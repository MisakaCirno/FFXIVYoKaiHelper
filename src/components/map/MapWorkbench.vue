<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { COMPACT_LAYOUT_QUERY, CONSTRAINED_LAYOUT_QUERY, useMediaQuery } from '../../composables/useMediaQuery'
import { JOBS } from '../../data/jobs'
import DetailSidebar from '../details/DetailSidebar.vue'
import MacroDialog from '../tools/MacroDialog.vue'
import MapCanvas from './MapCanvas.vue'
import RegionSidebar from './RegionSidebar.vue'

const props = defineProps<{
  selectedRegionId: string | null
  selectedJobId: string | null
  selectedZoneId: string | null
  completedJobIds: readonly string[]
}>()

const emit = defineEmits<{
  'select-region': [regionId: string | null]
  'select-job': [jobId: string]
  'clear-job': []
  'select-zone': [zoneId: string]
  'activate-map-job': [jobId: string]
  'toggle-job-completion': [jobId: string]
}>()

const detailsOpen = ref(false)
const regionsOpen = ref(true)
const macroOpen = ref(false)
const compactLayout = useMediaQuery(COMPACT_LAYOUT_QUERY)
const constrainedLayout = useMediaQuery(CONSTRAINED_LAYOUT_QUERY)

watch(
  () => props.selectedJobId,
  (jobId) => {
    if (jobId) {
      detailsOpen.value = true
      if (constrainedLayout.value) regionsOpen.value = false
    }
  },
)

watch(compactLayout, (compact) => {
  if (compact) regionsOpen.value = false
  else if (!macroOpen.value && !(constrainedLayout.value && detailsOpen.value)) regionsOpen.value = true
})

watch(constrainedLayout, (constrained) => {
  if (constrained && detailsOpen.value) regionsOpen.value = false
})

function selectRegion(regionId: string | null) {
  emit('select-region', regionId)
  if (compactLayout.value) regionsOpen.value = false
}

function selectZone(zoneId: string) {
  emit('select-zone', zoneId)
  if (compactLayout.value) regionsOpen.value = false
}

function openDetails() {
  detailsOpen.value = true
  if (constrainedLayout.value) regionsOpen.value = false
}

function openRegions() {
  regionsOpen.value = true
  if (constrainedLayout.value) detailsOpen.value = false
}

function openMacros() {
  macroOpen.value = true
  detailsOpen.value = false
  regionsOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (macroOpen.value) macroOpen.value = false
  else if (detailsOpen.value) detailsOpen.value = false
  else if (regionsOpen.value) regionsOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="workbench"
    :class="{ 'is-region-sidebar-open': regionsOpen, 'is-detail-sidebar-open': detailsOpen }"
    aria-label="地图工作台"
  >
    <MapCanvas
      :selected-region-id="selectedRegionId"
      :selected-job-id="selectedJobId"
      :selected-zone-id="selectedZoneId"
      :completed-job-ids="completedJobIds"
      @select-region="selectRegion"
      @select-job="emit('activate-map-job', $event)"
      @select-zone="selectZone"
    />

    <RegionSidebar
      :class="{ 'is-open': regionsOpen }"
      :selected-region-id="selectedRegionId"
      :role="compactLayout ? 'dialog' : undefined"
      :aria-modal="compactLayout && regionsOpen ? 'true' : undefined"
      :aria-hidden="!regionsOpen ? 'true' : undefined"
      :inert="!regionsOpen"
      @select-region="selectRegion"
      @close="regionsOpen = false"
    />

    <button
      v-if="!regionsOpen"
      type="button"
      class="region-drawer-trigger"
      :aria-expanded="regionsOpen"
      aria-controls="region-navigation-drawer"
      @click="openRegions"
    >
      <span aria-hidden="true">◈</span>
      <strong>地区</strong>
    </button>

    <button
      type="button"
      class="region-backdrop"
      :class="{ 'is-visible': regionsOpen }"
      aria-label="关闭地区导航"
      @click="regionsOpen = false"
    ></button>

    <div class="map-drop-legend" aria-label="武器素材掉落图例">
      <span class="is-guwu"><i aria-hidden="true">古</i>古武</span>
      <span class="is-hunwu"><i aria-hidden="true">魂</i>魂武</span>
      <span class="is-yiwu"><i aria-hidden="true">义</i>义武</span>
    </div>

    <button
      type="button"
      class="detail-drawer-trigger"
      :aria-expanded="detailsOpen"
      aria-controls="job-detail-drawer"
      @click="openDetails"
    >
      <span aria-hidden="true">◇</span>
      <strong>职业</strong>
      <small>{{ completedJobIds.length }} / {{ JOBS.length }}</small>
    </button>

    <button
      v-show="!detailsOpen && !macroOpen"
      type="button"
      class="macro-dialog-trigger"
      aria-haspopup="dialog"
      aria-controls="macro-command-dialog"
      @click="openMacros"
    >
      <span aria-hidden="true">⌘</span>
      <strong>宏</strong>
    </button>

    <button
      type="button"
      class="detail-backdrop"
      :class="{ 'is-visible': detailsOpen }"
      aria-label="关闭详情面板"
      @click="detailsOpen = false"
    ></button>
    <DetailSidebar
      id="job-detail-drawer"
      :class="{ 'is-drawer-open': detailsOpen }"
      :role="compactLayout ? 'dialog' : undefined"
      :aria-modal="compactLayout && detailsOpen ? 'true' : undefined"
      :aria-hidden="!detailsOpen ? 'true' : undefined"
      :inert="!detailsOpen"
      :selected-region-id="selectedRegionId"
      :selected-job-id="selectedJobId"
      :selected-zone-id="selectedZoneId"
      :completed-job-ids="completedJobIds"
      @select-region="emit('select-region', $event)"
      @select-job="emit('select-job', $event)"
      @clear-job="emit('clear-job')"
      @select-zone="emit('select-zone', $event)"
      @toggle-job-completion="emit('toggle-job-completion', $event)"
      @close="detailsOpen = false"
    />

    <Teleport to="body">
      <MacroDialog
        v-if="macroOpen"
        :selected-job-id="selectedJobId"
        @close="macroOpen = false"
      />
    </Teleport>
  </div>
</template>
