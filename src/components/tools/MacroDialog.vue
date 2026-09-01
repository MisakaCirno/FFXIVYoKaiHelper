<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useDialogFocus } from '../../composables/useDialogFocus'
import { JOBS } from '../../data/jobs'
import { assetUrl } from '../../services/assets'
import { writeTextToClipboard } from '../../services/clipboard'

type MacroTab = 'pet' | 'weapon'

interface MacroItem {
  readonly id: string
  readonly jobId: string
  readonly jobName: string
  readonly name: string
  readonly icon: string
  readonly command: string
}

const props = defineProps<{
  selectedJobId: string | null
}>()

const emit = defineEmits<{
  close: []
}>()

const activeTab = ref<MacroTab>('pet')
const copiedId = ref<string | null>(null)
const copyFailed = ref(false)
const dialogElement = ref<HTMLElement | null>(null)
const active = ref(true)
let resetTimer = 0
const { handleDialogKeydown } = useDialogFocus(dialogElement, active, () => emit('close'))

const petMacros: readonly MacroItem[] = JOBS.map((job) => ({
  id: `pet:${job.id}`,
  jobId: job.id,
  jobName: job.name,
  name: job.pet,
  icon: assetUrl(`images/pet_icon/${job.pet}.png`),
  command: `/minion ${job.pet}`,
}))

const weaponMacros: readonly MacroItem[] = JOBS.flatMap((job) => job.weapons.map((weapon) => ({
  id: `weapon:${job.id}:${weapon}`,
  jobId: job.id,
  jobName: job.name,
  name: weapon,
  icon: assetUrl(`images/weapon_icon/${weapon}.png`),
  command: `/isearch ${weapon}`,
})))

const visibleMacros = computed(() => activeTab.value === 'pet' ? petMacros : weaponMacros)
const copiedName = computed(() => [...petMacros, ...weaponMacros].find((item) => item.id === copiedId.value)?.name)

async function copyMacro(item: MacroItem) {
  window.clearTimeout(resetTimer)
  copyFailed.value = false
  try {
    await writeTextToClipboard(item.command)
    copiedId.value = item.id
    resetTimer = window.setTimeout(() => {
      copiedId.value = null
    }, 1800)
  } catch {
    copiedId.value = null
    copyFailed.value = true
  }
}

function selectTab(tab: MacroTab) {
  activeTab.value = tab
  copiedId.value = null
  copyFailed.value = false
}

onBeforeUnmount(() => window.clearTimeout(resetTimer))
</script>

<template>
  <div
    id="macro-command-dialog"
    ref="dialogElement"
    class="macro-dialog-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="macro-dialog-title"
    tabindex="-1"
    @click.self="emit('close')"
    @keydown="handleDialogKeydown"
  >
    <section class="macro-dialog">
      <header class="macro-dialog__header">
        <span>
          <small>游戏内快捷命令</small>
          <h2 id="macro-dialog-title">复制宏</h2>
        </span>
        <button type="button" aria-label="关闭复制宏弹窗" @click="emit('close')">×</button>
      </header>

      <div class="macro-dialog__tabs" role="tablist" aria-label="宏命令类型">
        <button
          id="pet-macro-tab"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'pet'"
          aria-controls="macro-list-panel"
          @click="selectTab('pet')"
        >宠物</button>
        <button
          id="weapon-macro-tab"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'weapon'"
          aria-controls="macro-list-panel"
          @click="selectTab('weapon')"
        >武器</button>
      </div>

      <div
        id="macro-list-panel"
        class="macro-dialog__list"
        role="tabpanel"
        :aria-labelledby="activeTab === 'pet' ? 'pet-macro-tab' : 'weapon-macro-tab'"
      >
        <article
          v-for="item in visibleMacros"
          :key="item.id"
          class="macro-list-item"
          :class="{ 'is-current-job': item.jobId === selectedJobId }"
        >
          <img :src="item.icon" alt="" />
          <span class="macro-list-item__name">
            <strong>{{ item.name }}</strong>
            <small>{{ item.jobName }}</small>
          </span>
          <code>{{ item.command }}</code>
          <button
            type="button"
            class="macro-copy-button"
            :class="{ 'is-copied': copiedId === item.id }"
            :aria-label="`复制${item.name}宏`"
            @click="copyMacro(item)"
          >{{ copiedId === item.id ? '已复制' : '复制' }}</button>
        </article>
      </div>

      <p class="macro-dialog__status" aria-live="polite">
        <template v-if="copyFailed">复制失败，请手动选择命令文本。</template>
        <template v-else-if="copiedName">已复制 {{ copiedName }} 的命令。</template>
        <template v-else>复制后可直接粘贴到游戏聊天框中执行。</template>
      </p>
    </section>
  </div>
</template>
