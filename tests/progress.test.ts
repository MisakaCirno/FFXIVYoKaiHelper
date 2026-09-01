import { describe, expect, it } from 'vitest'
import {
  LEGACY_PROGRESS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  createProgressState,
  loadProgress,
  toggleCompletedJob,
} from '../src/domain/progress'

class MemoryStorage {
  private values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

describe('progress state', () => {
  it('normalizes duplicate and invalid job ids', () => {
    expect(createProgressState(['骑士', '骑士', '不存在']).completedJobIds).toEqual(['骑士'])
  })

  it('migrates only job completion from the legacy mixed array', () => {
    const storage = new MemoryStorage()
    storage.setItem(LEGACY_PROGRESS_STORAGE_KEY, JSON.stringify(['骑士', '中拉诺西亚', '武士']))

    expect(loadProgress(storage).completedJobIds).toEqual(['骑士', '武士'])
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toContain('骑士')
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).not.toContain('中拉诺西亚')
  })

  it('toggles a valid job without mutating the previous state', () => {
    const initial = createProgressState(['骑士'])
    const removed = toggleCompletedJob(initial, '骑士')
    const added = toggleCompletedJob(removed, '武士')

    expect(initial.completedJobIds).toEqual(['骑士'])
    expect(removed.completedJobIds).toEqual([])
    expect(added.completedJobIds).toEqual(['武士'])
  })

  it('falls back to in-memory progress when storage access fails', () => {
    const storage = {
      getItem() { throw new Error('Storage blocked') },
      setItem() { throw new Error('Storage blocked') },
    }

    expect(loadProgress(storage).completedJobIds).toEqual([])
  })
})
