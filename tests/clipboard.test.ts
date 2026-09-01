// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { writeTextToClipboard } from '../src/services/clipboard'

afterEach(() => {
  Reflect.deleteProperty(navigator, 'clipboard')
  Reflect.deleteProperty(document, 'execCommand')
})

describe('clipboard service', () => {
  it('falls back to the legacy copy command when clipboard permission is denied', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) },
    })
    const execCommand = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand })

    await writeTextToClipboard('/minion 武士猫')

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('rejects cleanly when both clipboard paths fail', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) },
    })
    Object.defineProperty(document, 'execCommand', { configurable: true, value: vi.fn().mockReturnValue(false) })

    await expect(writeTextToClipboard('test')).rejects.toThrow('Clipboard copy was rejected')
    expect(document.querySelector('textarea')).toBeNull()
  })
})
