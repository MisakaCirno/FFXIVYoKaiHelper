<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { JOBS } from '../../data/jobs'
import {
  getJob,
  getJobsForRegion,
  getJobsForZone,
  getRegion,
  getRelicDropsForZone,
  getZone,
} from '../../domain/selectors'
import type { Job } from '../../domain/types'
import { assetUrl } from '../../services/assets'
import JobDetail from './JobDetail.vue'
import JobListPanel from './JobListPanel.vue'
import RewardPreviewDialog from './RewardPreviewDialog.vue'
import type { RewardPreview } from './types'

const props = defineProps<{
  selectedRegionId: string | null
  selectedJobId: string | null
  selectedZoneId: string | null
  completedJobIds: readonly string[]
}>()

const emit = defineEmits<{
  'select-region': [regionId: string]
  'select-job': [jobId: string]
  'clear-job': []
  'select-zone': [zoneId: string]
  'toggle-job-completion': [jobId: string]
  close: []
}>()

const selectedJob = computed(() => props.selectedJobId ? getJob(props.selectedJobId) : undefined)
const selectedZone = computed(() => props.selectedZoneId ? getZone(props.selectedZoneId) : undefined)
const selectedRegion = computed(() => props.selectedRegionId ? getRegion(props.selectedRegionId) : undefined)
const completed = computed(() => new Set(props.completedJobIds))
const contextJobs = computed(() => {
  if (selectedZone.value) return getJobsForZone(selectedZone.value.id)
  if (selectedRegion.value) return getJobsForRegion(selectedRegion.value.id)
  return JOBS
})
const zoneRelicDrops = computed(() => selectedZone.value ? getRelicDropsForZone(selectedZone.value.id) : [])
const listTitle = computed(() => selectedZone.value?.name ?? selectedRegion.value?.name ?? '全部职业')
const listKicker = computed(() => {
  if (selectedZone.value) return '当前地图的掉落职业'
  if (selectedRegion.value) return '当前地区职业'
  return '职业查找地图'
})

const detailedMode = ref(false)
const rewardPreview = ref<RewardPreview | null>(null)

function showPetPreview(job: Job) {
  rewardPreview.value = {
    src: assetUrl(`images/pet_detail/${job.pet}.jpg`),
    title: job.pet,
    kind: `${job.name}的联动宠物`,
  }
}

function showWeaponPreview(job: Job, weapon: string) {
  rewardPreview.value = {
    src: assetUrl(`images/weapon_detail/${job.id}.jpg`),
    title: weapon,
    kind: `${job.name}的妖怪武器`,
  }
}

watch(() => props.selectedJobId, () => {
  rewardPreview.value = null
})
</script>

<template>
  <aside class="detail-panel detail-panel--live" aria-labelledby="detail-title">
    <div class="mobile-drawer-handle" aria-hidden="true"></div>
    <div class="detail-panel__topline">
      <span>职业侧栏</span>
      <span class="detail-panel__actions">
        <span class="detail-panel__count">{{ completed.size }} / {{ JOBS.length }} 已完成</span>
        <button
          type="button"
          class="sidebar-mode-toggle"
          :aria-pressed="detailedMode"
          aria-label="职业列表详细模式"
          @click="detailedMode = !detailedMode"
        >
          <span>详细</span>
          <i aria-hidden="true"></i>
        </button>
        <button type="button" class="mobile-drawer-close" aria-label="关闭详情面板" @click="emit('close')">×</button>
      </span>
    </div>

    <JobDetail
      v-if="selectedJob"
      :job="selectedJob"
      :completed="completed.has(selectedJob.id)"
      @back="emit('clear-job')"
      @select-region="emit('select-region', $event)"
      @select-zone="emit('select-zone', $event)"
      @toggle-completion="emit('toggle-job-completion', selectedJob.id)"
    />
    <JobListPanel
      v-else
      :jobs="contextJobs"
      :relic-drops="zoneRelicDrops"
      :completed-job-ids="completedJobIds"
      :detailed="detailedMode"
      :title="listTitle"
      :kicker="listKicker"
      @select-job="emit('select-job', $event)"
      @toggle-completion="emit('toggle-job-completion', $event)"
      @preview-pet="showPetPreview"
      @preview-weapon="showWeaponPreview"
    />

    <RewardPreviewDialog v-if="rewardPreview" :preview="rewardPreview" @close="rewardPreview = null" />
  </aside>
</template>
