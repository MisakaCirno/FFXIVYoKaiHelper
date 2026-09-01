<script setup lang="ts">
import { ref } from 'vue'
import MapWorkbench from './components/map/MapWorkbench.vue'
import { useProgress } from './composables/useProgress'
import { getZone } from './domain/selectors'

const selectedRegionId = ref<string | null>(null)
const selectedJobId = ref<string | null>(null)
const selectedZoneId = ref<string | null>(null)
const { completedJobIds, toggleJob } = useProgress()

function selectRegion(regionId: string | null) {
  selectedRegionId.value = regionId
  selectedZoneId.value = null
}

function selectJob(jobId: string) {
  selectedJobId.value = jobId
}

function selectZone(zoneId: string) {
  const zone = getZone(zoneId)
  if (zone) selectedRegionId.value = zone.regionId
  selectedZoneId.value = zoneId
  selectedJobId.value = null
}

function clearJob() {
  selectedJobId.value = null
}

function toggleMapJob(jobId: string) {
  selectedJobId.value = jobId
  toggleJob(jobId)
}
</script>

<template>
  <div class="app-shell">
    <main class="app-main app-main--fullscreen">
      <MapWorkbench
        :selected-region-id="selectedRegionId"
        :selected-job-id="selectedJobId"
        :selected-zone-id="selectedZoneId"
        :completed-job-ids="[...completedJobIds]"
        @select-region="selectRegion"
        @select-job="selectJob"
        @clear-job="clearJob"
        @select-zone="selectZone"
        @activate-map-job="toggleMapJob"
        @toggle-job-completion="toggleJob"
      />
    </main>
  </div>
</template>
