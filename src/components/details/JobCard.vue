<script setup lang="ts">
import { ROLE_LABELS } from '../../data/jobs'
import type { Job } from '../../domain/types'
import { assetUrl } from '../../services/assets'

defineProps<{
  job: Job
  completed: boolean
}>()

const emit = defineEmits<{
  select: []
  'toggle-completion': []
  'preview-pet': []
  'preview-weapon': [weapon: string]
}>()
</script>

<template>
  <article class="sidebar-job-card" :class="{ 'is-complete': completed }">
    <div class="sidebar-job-card__header">
      <button
        type="button"
        class="sidebar-job-card__heading"
        :aria-label="`查看${job.name}详情`"
        @click="emit('select')"
      >
        <img :src="assetUrl(`images/job_icon/${job.id}.png`)" alt="" />
        <span><strong>{{ job.name }}</strong><small>{{ ROLE_LABELS[job.role] }}</small></span>
      </button>
      <button
        type="button"
        class="sidebar-job-completion"
        :class="{ 'is-complete': completed }"
        :aria-label="completed ? `取消${job.name}的完成标记` : `标记${job.name}为已完成`"
        :aria-pressed="completed"
        @click="emit('toggle-completion')"
      >
        <span aria-hidden="true">{{ completed ? '✓' : '○' }}</span>
      </button>
    </div>
    <div class="sidebar-job-card__rewards">
      <button
        type="button"
        class="sidebar-reward-button"
        :aria-label="`预览宠物${job.pet}`"
        @click="emit('preview-pet')"
      >
        <img :src="assetUrl(`images/pet_icon/${job.pet}.png`)" alt="" />
        <span><small>宠物</small><strong>{{ job.pet }}</strong></span>
      </button>
      <button
        v-for="weapon in job.weapons"
        :key="weapon"
        type="button"
        class="sidebar-reward-button"
        :aria-label="`预览武器${weapon}`"
        @click="emit('preview-weapon', weapon)"
      >
        <img :src="assetUrl(`images/weapon_icon/${weapon}.png`)" alt="" />
        <span><small>武器</small><strong>{{ weapon }}</strong></span>
      </button>
    </div>
  </article>
</template>
