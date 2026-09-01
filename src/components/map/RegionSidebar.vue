<script setup lang="ts">
import { computed, ref } from 'vue'
import { REGIONS } from '../../data/maps'
import { getJobsForRegion, getRelicDropsForRegion } from '../../domain/selectors'
import { assetUrl } from '../../services/assets'

defineProps<{
  selectedRegionId: string | null
}>()

const emit = defineEmits<{
  'select-region': [regionId: string | null]
  close: []
}>()

const detailedMode = ref(false)
const regionItems = computed(() => REGIONS.map((region) => ({
  region,
  jobs: getJobsForRegion(region.id),
  relicDrops: getRelicDropsForRegion(region.id),
})))
</script>

<template>
  <aside id="region-navigation-drawer" class="region-sidebar" aria-label="地区导航">
    <header class="region-sidebar__brand">
      <img :src="assetUrl('icon.png')" alt="" />
      <span>
        <strong>FF14 妖表助手</strong>
        <small>地图收集工具</small>
      </span>
      <span class="region-sidebar__actions">
        <button type="button" class="region-sidebar__close" aria-label="收起地区导航" @click="emit('close')">×</button>
      </span>
    </header>

    <div class="region-sidebar__mode-row">
      <span class="region-sidebar__mode-copy">
        <strong>地区列表</strong>
        <small>{{ detailedMode ? '显示职业与武器素材' : '仅显示地区名称' }}</small>
      </span>
      <button
        type="button"
        class="sidebar-mode-toggle"
        :aria-pressed="detailedMode"
        aria-label="地区列表详细模式"
        @click="detailedMode = !detailedMode"
      >
        <span>详细</span>
        <i aria-hidden="true"></i>
      </button>
    </div>

    <nav class="region-nav" aria-label="切换地图地区">
      <p class="region-nav__label">地图层级</p>
      <button
        class="region-nav__root"
        type="button"
        :class="{ 'is-active': !selectedRegionId, 'is-ancestor': selectedRegionId }"
        :aria-current="!selectedRegionId ? 'page' : undefined"
        @click="emit('select-region', null)"
      >
        <span><strong>艾欧泽亚</strong></span>
      </button>
      <div class="region-nav__children" :class="{ 'has-active-child': selectedRegionId, 'is-detailed': detailedMode }">
        <span class="region-nav__children-label">下属大区</span>
        <button
          v-for="item in regionItems"
          :key="item.region.id"
          class="region-nav__child"
          type="button"
          :class="{ 'is-active': selectedRegionId === item.region.id, 'is-detailed': detailedMode }"
          :aria-current="selectedRegionId === item.region.id ? 'page' : undefined"
          :aria-label="`切换到${item.region.name}地图`"
          @click="emit('select-region', item.region.id)"
        >
          <span><strong>{{ item.region.name }}</strong></span>
          <span v-if="detailedMode" class="region-nav__child-details">
            <span class="region-nav__detail-group">
              <small>职业</small>
              <span class="region-nav__icon-list">
                <img
                  v-for="job in item.jobs"
                  :key="job.id"
                  class="region-nav__job-icon"
                  :src="assetUrl(`images/job_icon/${job.id}.png`)"
                  alt=""
                />
              </span>
            </span>
            <span v-if="item.relicDrops.length" class="region-nav__detail-group">
              <small>素材</small>
              <span class="region-nav__icon-list">
                <img
                  v-for="drop in item.relicDrops"
                  :key="drop.id"
                  class="region-nav__relic-icon"
                  :class="`is-${drop.type}`"
                  :src="assetUrl(`images/other_icon/${drop.type}/${drop.name}.png`)"
                  alt=""
                />
              </span>
            </span>
          </span>
        </button>
      </div>
    </nav>

    <p class="region-sidebar__hint">选择大区后，可查看其中全部区域名称与掉落。</p>
  </aside>
</template>
