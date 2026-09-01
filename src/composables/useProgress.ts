import { computed, ref } from 'vue'
import { createProgressState, loadProgress, saveProgress, toggleCompletedJob } from '../domain/progress'

export function useProgress() {
  let storage: Storage | null = null
  try {
    storage = typeof window === 'undefined' ? null : window.localStorage
  } catch {
    // Some privacy modes expose window.localStorage but throw when it is accessed.
  }
  const state = ref(storage ? loadProgress(storage) : createProgressState())
  const completedJobIds = computed<ReadonlySet<string>>(
    () => new Set(state.value.completedJobIds),
  )

  function toggleJob(jobId: string) {
    state.value = toggleCompletedJob(state.value, jobId)
    if (storage) saveProgress(storage, state.value)
  }

  return { state, completedJobIds, toggleJob }
}
