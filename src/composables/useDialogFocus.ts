import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useDialogFocus(
  dialogElement: Ref<HTMLElement | null>,
  active: Readonly<Ref<boolean>>,
  close: () => void,
) {
  let restoreTarget: HTMLElement | null = null

  function restoreFocus() {
    const target = restoreTarget
    restoreTarget = null
    window.setTimeout(() => target?.isConnected && target.focus(), 0)
  }

  watch(active, async (isActive, wasActive) => {
    if (isActive) {
      restoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null
      await nextTick()
      dialogElement.value?.focus()
    } else if (wasActive) {
      restoreFocus()
    }
  }, { immediate: true, flush: 'post' })

  function handleDialogKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation()
      event.preventDefault()
      close()
      return
    }
    if (event.key !== 'Tab' || !dialogElement.value) return

    const focusable = [...dialogElement.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
      .filter((element) => element.tabIndex >= 0)
    if (focusable.length === 0) {
      event.preventDefault()
      dialogElement.value.focus()
      return
    }

    const first = focusable[0]
    const last = focusable.at(-1)!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    } else if (!dialogElement.value.contains(document.activeElement)) {
      event.preventDefault()
      first.focus()
    }
  }

  onBeforeUnmount(restoreFocus)
  return { handleDialogKeydown }
}
