import { JOB_IDS } from '../data/jobs'
import type { ProgressState } from './types'

export const PROGRESS_STORAGE_KEY = 'ffxiv-yokai-progress-v2'
export const LEGACY_PROGRESS_STORAGE_KEY = 'selectedData'

const validJobIds = new Set<string>(JOB_IDS)

export function createProgressState(completedJobIds: Iterable<string> = []): ProgressState {
  return {
    version: 2,
    completedJobIds: [...new Set(completedJobIds)].filter((jobId) => validJobIds.has(jobId)),
  }
}

function parseStoredArray(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function readStorage(storage: Pick<Storage, 'getItem'>, key: string): string | null {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function loadProgress(storage: Pick<Storage, 'getItem' | 'setItem'>): ProgressState {
  const currentValue = readStorage(storage, PROGRESS_STORAGE_KEY)
  if (currentValue) {
    try {
      const parsed: unknown = JSON.parse(currentValue)
      if (parsed && typeof parsed === 'object' && 'completedJobIds' in parsed) {
        const candidate = (parsed as { completedJobIds?: unknown }).completedJobIds
        if (Array.isArray(candidate)) {
          return createProgressState(candidate.filter((item): item is string => typeof item === 'string'))
        }
      }
    } catch {
      // 损坏的新版本状态会继续尝试迁移旧版数据。
    }
  }

  const migrated = createProgressState(parseStoredArray(readStorage(storage, LEGACY_PROGRESS_STORAGE_KEY)))
  saveProgress(storage, migrated)
  return migrated
}

export function saveProgress(storage: Pick<Storage, 'setItem'>, state: ProgressState): void {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(createProgressState(state.completedJobIds)))
  } catch {
    // Restricted storage and quota errors should not block in-memory progress updates.
  }
}

export function toggleCompletedJob(state: ProgressState, jobId: string): ProgressState {
  if (!validJobIds.has(jobId)) return state

  const completed = new Set(state.completedJobIds)
  if (completed.has(jobId)) completed.delete(jobId)
  else completed.add(jobId)
  return createProgressState(completed)
}
