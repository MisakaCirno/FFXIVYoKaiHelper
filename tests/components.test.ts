// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DetailSidebar from '../src/components/details/DetailSidebar.vue'
import RegionSidebar from '../src/components/map/RegionSidebar.vue'
import MacroDialog from '../src/components/tools/MacroDialog.vue'

const baseProps = {
  selectedRegionId: null,
  selectedJobId: null,
  selectedZoneId: null,
  completedJobIds: [] as string[],
}

describe('detail sidebar', () => {
  it('offers all jobs from the default overview', async () => {
    const wrapper = mount(DetailSidebar, { props: baseProps })

    expect(wrapper.findAll('.sidebar-job-grid button')).toHaveLength(17)
    await wrapper.find('.sidebar-job-grid button').trigger('click')
    expect(wrapper.emitted('select-job')).toEqual([['骑士']])
  })

  it('renders job rewards and emits completion changes', async () => {
    const wrapper = mount(DetailSidebar, {
      props: { ...baseProps, selectedJobId: '舞者', completedJobIds: ['舞者'] },
    })

    expect(wrapper.text()).toContain('百鬼公主')
    expect(wrapper.text()).toContain('百鬼圆阵')
    expect(wrapper.text()).toContain('红玉海')
    const backButton = wrapper.get('button.detail-back-button')
    await backButton.trigger('click')
    expect(wrapper.emitted('clear-job')).toEqual([[]])
    const completionButton = wrapper.get('button.completion-button')
    expect(completionButton.attributes('aria-pressed')).toBe('true')
    await completionButton.trigger('click')
    expect(wrapper.emitted('toggle-job-completion')).toEqual([['舞者']])
  })

  it('derives the relevant jobs for a selected zone', () => {
    const wrapper = mount(DetailSidebar, {
      props: { ...baseProps, selectedZoneId: '红玉海' },
    })

    expect(wrapper.findAll('.sidebar-job-grid button')).toHaveLength(2)
    expect(wrapper.text()).toContain('绝枪战士')
    expect(wrapper.text()).toContain('舞者')
    expect(wrapper.text()).toContain('忌讳的记忆晶块')
    expect(wrapper.text()).toContain('义武')
  })

  it('shows clickable pet and weapon previews in detailed mode', async () => {
    const wrapper = mount(DetailSidebar, { props: baseProps })

    await wrapper.get('[aria-label="职业列表详细模式"]').trigger('click')
    expect(wrapper.findAll('.sidebar-job-card')).toHaveLength(17)
    expect(wrapper.text()).toContain('武士猫')
    expect(wrapper.text()).toContain('妖刀·猫丸')

    const completionButton = wrapper.get('[aria-label="标记骑士为已完成"]')
    expect(completionButton.attributes('aria-pressed')).toBe('false')
    await completionButton.trigger('click')
    expect(wrapper.emitted('toggle-job-completion')).toEqual([['骑士']])
    expect(wrapper.emitted('select-job')).toBeUndefined()

    await wrapper.get('[aria-label="预览宠物武士猫"]').trigger('click')
    const preview = document.body.querySelector('.reward-preview')
    expect(preview?.textContent).toContain('武士猫')
    expect(preview?.querySelector('img')?.getAttribute('src')).toBe('/images/pet_detail/武士猫.jpg')
    expect(document.activeElement).toBe(preview)

    preview?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.reward-preview')).toBeNull()
    await wrapper.get('[aria-label="预览武器妖刀·猫丸"]').trigger('click')
    expect(document.body.querySelector('.reward-preview img')?.getAttribute('src')).toBe('/images/weapon_detail/骑士.jpg')

    wrapper.unmount()
  })
})

describe('region sidebar', () => {
  it('offers the world overview and eight regions without a third level', async () => {
    const wrapper = mount(RegionSidebar, { props: { selectedRegionId: null } })

    const root = wrapper.find('.region-nav__root')
    const children = wrapper.findAll('.region-nav__children > .region-nav__child')
    expect(root.text()).toBe('艾欧泽亚')
    expect(children).toHaveLength(8)
    await children.at(-1)?.trigger('click')
    expect(wrapper.emitted('select-region')).toEqual([['奥萨德']])
    expect(wrapper.find('.region-tree__toggle').exists()).toBe(false)
  })

  it('shows jobs and weapon materials for every region in detailed mode', async () => {
    const wrapper = mount(RegionSidebar, { props: { selectedRegionId: null } })

    expect(wrapper.find('.region-sidebar__current').exists()).toBe(false)
    expect(wrapper.find('.region-sidebar__mode-row [aria-label="地区列表详细模式"]').exists()).toBe(true)
    await wrapper.get('[aria-label="地区列表详细模式"]').trigger('click')
    expect(wrapper.findAll('.region-nav__child-details')).toHaveLength(8)
    expect(wrapper.findAll('.region-nav__child.is-detailed')).toHaveLength(8)
    expect(wrapper.findAll('.region-nav__job-icon').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.region-nav__relic-icon').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('职业')
    expect(wrapper.text()).toContain('素材')
  })
})

describe('macro dialog', () => {
  it('switches between pet and weapon commands and copies with one click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    const wrapper = mount(MacroDialog, { props: { selectedJobId: '武士' }, attachTo: document.body })
    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(wrapper.element)
    expect(wrapper.findAll('.macro-list-item')).toHaveLength(17)
    expect(wrapper.text()).toContain('/minion 武士猫')
    await wrapper.get('[aria-label="复制武士猫宏"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('/minion 武士猫')
    expect(wrapper.get('[aria-label="复制武士猫宏"]').text()).toBe('已复制')

    await wrapper.get('#weapon-macro-tab').trigger('click')
    expect(wrapper.findAll('.macro-list-item')).toHaveLength(18)
    expect(wrapper.text()).toContain('/isearch 妖刀·猫丸')
    await wrapper.get('[aria-label="复制妖刀·猫丸宏"]').trigger('click')
    expect(writeText).toHaveBeenLastCalledWith('/isearch 妖刀·猫丸')

    await wrapper.get('[aria-label="关闭复制宏弹窗"]').trigger('click')
    expect(wrapper.emitted('close')).toEqual([[]])
    wrapper.unmount()
    Reflect.deleteProperty(navigator, 'clipboard')
  })

  it('traps keyboard focus and restores it after closing', async () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    const wrapper = mount(MacroDialog, { props: { selectedJobId: null }, attachTo: document.body })
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    buttons.at(-1)?.element.focus()
    await wrapper.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(buttons[0].element)

    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('close')).toEqual([[]])
    wrapper.unmount()
    await new Promise((resolve) => window.setTimeout(resolve, 0))
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })
})
