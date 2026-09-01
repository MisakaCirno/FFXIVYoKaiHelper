<script setup lang="ts">
import { ref } from 'vue'
import { useDialogFocus } from '../../composables/useDialogFocus'
import type { RewardPreview } from './types'

defineProps<{
  preview: RewardPreview
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogElement = ref<HTMLElement | null>(null)
const active = ref(true)
const { handleDialogKeydown } = useDialogFocus(dialogElement, active, () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <div
      ref="dialogElement"
      class="reward-preview"
      role="dialog"
      aria-modal="true"
      :aria-label="`${preview.title}预览`"
      tabindex="-1"
      @click.self="emit('close')"
      @keydown="handleDialogKeydown"
    >
      <figure class="reward-preview__dialog">
        <button type="button" aria-label="关闭预览图" @click="emit('close')">×</button>
        <figcaption><small>{{ preview.kind }}</small><strong>{{ preview.title }}</strong></figcaption>
        <img :src="preview.src" :alt="`${preview.title}预览图`" />
      </figure>
    </div>
  </Teleport>
</template>
