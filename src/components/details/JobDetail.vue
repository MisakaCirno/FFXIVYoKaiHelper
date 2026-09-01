<script setup lang="ts">
import { computed } from 'vue'
import { ROLE_LABELS } from '../../data/jobs'
import { getRegionsForJob } from '../../domain/selectors'
import type { Job } from '../../domain/types'
import { assetUrl } from '../../services/assets'

const props = defineProps<{
  job: Job
  completed: boolean
}>()

const emit = defineEmits<{
  back: []
  'select-region': [regionId: string]
  'select-zone': [zoneId: string]
  'toggle-completion': []
}>()

const regions = computed(() => getRegionsForJob(props.job.id))
</script>

<template>
  <section class="job-detail">
    <button type="button" class="detail-back-button" @click="emit('back')">
      <span aria-hidden="true">←</span>
      返回职业列表
    </button>
    <header class="job-detail__header">
      <img :src="assetUrl(`images/job_icon/${job.id}.png`)" alt="" />
      <div>
        <p>{{ ROLE_LABELS[job.role] }}</p>
        <h2 id="detail-title">{{ job.name }}</h2>
      </div>
    </header>

    <button
      type="button"
      class="completion-button"
      :class="{ 'is-complete': completed }"
      :aria-pressed="completed"
      @click="emit('toggle-completion')"
    >
      <span aria-hidden="true">{{ completed ? '✓' : '○' }}</span>
      {{ completed ? '已完成，点击取消' : '标记这个职业为已完成' }}
    </button>

    <div class="detail-section">
      <h3>联动宠物</h3>
      <div class="reward-card">
        <img :src="assetUrl(`images/pet_icon/${job.pet}.png`)" alt="" />
        <strong>{{ job.pet }}</strong>
      </div>
      <img class="detail-art" :src="assetUrl(`images/pet_detail/${job.pet}.jpg`)" :alt="`${job.pet}宠物预览`" loading="lazy" />
    </div>

    <div class="detail-section">
      <h3>妖怪武器</h3>
      <div class="reward-list">
        <div v-for="weapon in job.weapons" :key="weapon" class="reward-card">
          <img :src="assetUrl(`images/weapon_icon/${weapon}.png`)" alt="" />
          <strong>{{ weapon }}</strong>
        </div>
      </div>
      <img class="detail-art" :src="assetUrl(`images/weapon_detail/${job.id}.jpg`)" :alt="`${job.name}武器预览`" loading="lazy" />
    </div>

    <div class="detail-section">
      <h3>掉落地区</h3>
      <div class="region-link-list">
        <button v-for="region in regions" :key="region.id" type="button" @click="emit('select-region', region.id)">{{ region.name }}</button>
      </div>
      <div class="zone-link-list">
        <button v-for="zoneId in job.zoneIds" :key="zoneId" type="button" @click="emit('select-zone', zoneId)">{{ zoneId }}</button>
      </div>
    </div>
  </section>
</template>
