import { RELIC_TYPE_LABELS, RELIC_TYPE_SHORT_LABELS } from '../../data/relicDrops'
import type { RelicDrop, RelicType } from '../../domain/types'
import { assetUrl } from '../../services/assets'

const relicTypes: readonly RelicType[] = ['guwu', 'hunwu', 'yiwu']

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function placeLabelWidth(name: string) {
  return Math.max(108, Math.min(180, 34 + name.length * 12))
}

export function renderPlaceName(
  name: string,
  target?: { readonly type: 'region' | 'zone'; readonly id: string },
  active = false,
) {
  const activeClass = active ? ' is-active' : ''
  const currentAttribute = active ? ' aria-current="location"' : ''
  const nameContent = target
    ? `<button type="button" class="map-place-label__name" data-map-${target.type}="${escapeHtml(target.id)}"${currentAttribute}>${escapeHtml(name)}</button>`
    : `<span class="map-place-label__name is-static">${escapeHtml(name)}</span>`
  return `<div class="map-place-label${activeClass}">
    ${nameContent}
  </div>`
}

export function renderJobButtons(
  jobIds: readonly string[],
  options: { readonly selectedJobId: string | null; readonly completedJobIds: ReadonlySet<string> },
) {
  return jobIds.map((jobId) => {
    const activeClass = options.selectedJobId === jobId ? ' is-active' : ''
    const complete = options.completedJobIds.has(jobId)
    const completeClass = complete ? ' is-complete' : ''
    const safeId = escapeHtml(jobId)
    const actionLabel = complete ? '取消完成标记' : '标记为已完成'
    const image = assetUrl(`images/job_icon/${encodeURIComponent(jobId)}.png`)
    return `<button type="button" class="map-job-button${activeClass}${completeClass}" data-map-job="${safeId}" aria-label="${safeId}：${actionLabel}" aria-pressed="${complete}"><img src="${image}" alt=""></button>`
  }).join('')
}

export function renderRelicDropIcons(drops: readonly RelicDrop[]) {
  return drops.map((drop) => {
    const safeName = escapeHtml(drop.name)
    const image = assetUrl(`images/other_icon/${drop.type}/${encodeURIComponent(drop.name)}.png`)
    return `<span class="map-relic-drop is-${drop.type}" aria-label="${RELIC_TYPE_LABELS[drop.type]}：${safeName}"><img src="${image}" alt=""><b aria-hidden="true">${RELIC_TYPE_SHORT_LABELS[drop.type]}</b></span>`
  }).join('')
}

export function renderRelicDropSummary(drops: readonly RelicDrop[]) {
  return relicTypes.map((type) => {
    const count = drops.filter((drop) => drop.type === type).length
    return count ? `<span class="relic-summary-chip is-${type}">${RELIC_TYPE_LABELS[type]} ${count}</span>` : ''
  }).join('')
}
