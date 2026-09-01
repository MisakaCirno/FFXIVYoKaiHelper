import { onBeforeUnmount, onMounted, ref } from 'vue'

export const COMPACT_LAYOUT_QUERY = '(max-width: 700px)'
export const CONSTRAINED_LAYOUT_QUERY = '(max-width: 1000px)'

export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mediaQuery: MediaQueryList | null = null

  function sync(event?: MediaQueryListEvent) {
    matches.value = event?.matches ?? mediaQuery?.matches ?? false
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    sync()
    mediaQuery.addEventListener('change', sync)
  })
  onBeforeUnmount(() => mediaQuery?.removeEventListener('change', sync))

  return matches
}
