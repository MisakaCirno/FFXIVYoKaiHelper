<script setup lang="ts">
import { computed } from 'vue'
import { RELIC_TYPE_LABELS } from '../../data/relicDrops'
import type { Job, RelicDrop } from '../../domain/types'
import { assetUrl } from '../../services/assets'
import JobCard from './JobCard.vue'

const props = defineProps<{
  jobs: readonly Job[]
  relicDrops: readonly RelicDrop[]
  completedJobIds: readonly string[]
  detailed: boolean
  title: string
  kicker: string
}>()

const emit = defineEmits<{
  'select-job': [jobId: string]
  'toggle-completion': [jobId: string]
  'preview-pet': [job: Job]
  'preview-weapon': [job: Job, weapon: string]
}>()

const completed = computed(() => new Set(props.completedJobIds))
</script>

<template>
  <section class="overview-detail">
    <p class="detail-kicker">{{ kicker }}</p>
    <h2 id="detail-title">{{ title }}</h2>
    <p class="detail-copy">当前地图有 {{ jobs.length }} 个职业，选择一个查看宠物、武器和掉落地图。</p>
    <div v-if="relicDrops.length" class="zone-relic-drops">
      <h3>武器素材掉落</h3>
      <div class="zone-relic-drops__list">
        <div v-for="drop in relicDrops" :key="drop.id" :class="`is-${drop.type}`">
          <img :src="assetUrl(`images/other_icon/${drop.type}/${drop.name}.png`)" alt="" />
          <span><strong>{{ drop.name }}</strong><small>{{ RELIC_TYPE_LABELS[drop.type] }}</small></span>
        </div>
      </div>
    </div>
    <div class="sidebar-job-grid" :class="{ 'is-detailed': detailed }">
      <template v-for="job in jobs" :key="job.id">
        <button
          v-if="!detailed"
          type="button"
          class="sidebar-job-button"
          :class="{ 'is-complete': completed.has(job.id) }"
          :aria-label="`查看${job.name}详情`"
          @click="emit('select-job', job.id)"
        >
          <img :src="assetUrl(`images/job_icon/${job.id}.png`)" alt="" />
          <span>{{ job.name }}</span>
        </button>
        <JobCard
          v-else
          :job="job"
          :completed="completed.has(job.id)"
          @select="emit('select-job', job.id)"
          @toggle-completion="emit('toggle-completion', job.id)"
          @preview-pet="emit('preview-pet', job)"
          @preview-weapon="emit('preview-weapon', job, $event)"
        />
      </template>
    </div>
    <p v-if="jobs.length === 0" class="detail-list-empty">当前地图没有职业。</p>
  </section>
</template>
