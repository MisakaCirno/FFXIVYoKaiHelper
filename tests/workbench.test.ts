// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MapWorkbench from '../src/components/map/MapWorkbench.vue'

const MapCanvasStub = defineComponent({
  emits: ['select-region', 'select-job', 'select-zone'],
  template: '<button class="map-job-stub" @click="$emit(\'select-job\', \'骑士\')">地图职业</button>',
})
const RegionSidebarStub = defineComponent({
  emits: ['select-region', 'close'],
  template: '<aside class="region-sidebar"><button @click="$emit(\'close\')">关闭地区</button></aside>',
})
const DetailSidebarStub = defineComponent({
  emits: ['select-region', 'select-job', 'clear-job', 'select-zone', 'toggle-job-completion', 'close'],
  template: '<aside class="detail-panel"><button @click="$emit(\'close\')">关闭职业</button></aside>',
})
const MacroDialogStub = defineComponent({
  emits: ['close'],
  template: '<div class="macro-stub"><button @click="$emit(\'close\')">关闭宏</button></div>',
})

const baseProps = {
  selectedRegionId: null,
  selectedJobId: null,
  selectedZoneId: null,
  completedJobIds: [] as string[],
}

function installMatchMedia(compact = false, constrained = false) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes('700px') ? compact : constrained,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function mountWorkbench() {
  return mount(MapWorkbench, {
    props: baseProps,
    global: {
      stubs: {
        MapCanvas: MapCanvasStub,
        RegionSidebar: RegionSidebarStub,
        DetailSidebar: DetailSidebarStub,
        MacroDialog: MacroDialogStub,
      },
    },
  })
}

beforeEach(() => installMatchMedia())

describe('map workbench state', () => {
  it('uses explicit map-job semantics and keeps overlays mutually exclusive', async () => {
    const wrapper = mountWorkbench()
    await wrapper.get('.map-job-stub').trigger('click')
    expect(wrapper.emitted('activate-map-job')).toEqual([['骑士']])

    await wrapper.setProps({ selectedJobId: '骑士' })
    expect(wrapper.classes()).toContain('is-detail-sidebar-open')
    await wrapper.get('.detail-backdrop').trigger('click')
    await wrapper.get('.macro-dialog-trigger').trigger('click')
    expect(document.body.querySelector('.macro-stub')).not.toBeNull()
    expect(wrapper.classes()).not.toContain('is-region-sidebar-open')
    expect(wrapper.classes()).not.toContain('is-detail-sidebar-open')
    wrapper.unmount()
  })

  it('uses mutually exclusive modal panels on compact screens', async () => {
    installMatchMedia(true, true)
    const wrapper = mountWorkbench()
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).not.toContain('is-region-sidebar-open')

    await wrapper.get('.region-drawer-trigger').trigger('click')
    expect(wrapper.classes()).toContain('is-region-sidebar-open')
    await wrapper.get('.detail-drawer-trigger').trigger('click')
    expect(wrapper.classes()).not.toContain('is-region-sidebar-open')
    expect(wrapper.classes()).toContain('is-detail-sidebar-open')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).not.toContain('is-detail-sidebar-open')
    wrapper.unmount()
  })
})
