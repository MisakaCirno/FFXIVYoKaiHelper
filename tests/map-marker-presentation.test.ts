import { describe, expect, it } from 'vitest'
import { renderJobButtons, renderPlaceName, renderRelicDropSummary } from '../src/components/map/mapMarkerPresentation'
import { RELIC_DROPS } from '../src/data/relicDrops'

describe('map marker presentation', () => {
  it('escapes marker content and attributes', () => {
    const html = renderPlaceName('<地点>', { type: 'zone', id: 'a"b' }, true)
    expect(html).toContain('&lt;地点&gt;')
    expect(html).toContain('data-map-zone="a&quot;b"')
    expect(html).toContain('aria-current="location"')
  })

  it('renders non-interactive place names for contextual landmarks', () => {
    const html = renderPlaceName('利姆萨·罗敏萨')
    expect(html).toContain('map-place-label__name is-static')
    expect(html).not.toContain('<button')
  })

  it('renders explicit job completion state', () => {
    const html = renderJobButtons(['骑士'], {
      selectedJobId: '骑士',
      completedJobIds: new Set(['骑士']),
    })
    expect(html).toContain('is-active is-complete')
    expect(html).toContain('aria-pressed="true"')
  })

  it('summarizes only relic types present in a region', () => {
    const html = renderRelicDropSummary(RELIC_DROPS.slice(0, 2))
    expect(html).toContain('古武 2')
    expect(html).not.toContain('魂武')
  })
})
