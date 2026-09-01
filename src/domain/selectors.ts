import { JOBS } from '../data/jobs'
import { MAP_PLACES, REGIONS, ZONES } from '../data/maps'
import { RELIC_DROPS } from '../data/relicDrops'
import type { Job, Region, RelicDrop, Zone } from './types'

export const jobsById = new Map<string, Job>(JOBS.map((job) => [job.id, job]))
export const regionsById = new Map<string, Region>(REGIONS.map((region) => [region.id, region]))
export const zonesById = new Map<string, Zone>(ZONES.map((zone) => [zone.id, zone]))

export function getJob(jobId: string): Job | undefined {
  return jobsById.get(jobId)
}

export function getRegion(regionId: string): Region | undefined {
  return regionsById.get(regionId)
}

export function getZone(zoneId: string): Zone | undefined {
  return zonesById.get(zoneId)
}

export function getZonesForRegion(regionId: string): Zone[] {
  return ZONES.filter((zone) => zone.regionId === regionId)
}

export function getMapPlacesForRegion(regionId: string) {
  return MAP_PLACES.filter((place) => place.regionId === regionId)
}

export function getJobsForZone(zoneId: string): Job[] {
  return JOBS.filter((job) => job.zoneIds.some((candidate) => candidate === zoneId))
}

export function getJobsForRegion(regionId: string): Job[] {
  const zoneIds = new Set(getZonesForRegion(regionId).map((zone) => zone.id))
  return JOBS.filter((job) => job.zoneIds.some((zoneId) => zoneIds.has(zoneId)))
}

export function getRelicDropsForZone(zoneId: string): RelicDrop[] {
  return RELIC_DROPS.filter((drop) => drop.zoneIds.some((candidate) => candidate === zoneId))
}

export function getRelicDropsForRegion(regionId: string): RelicDrop[] {
  const zoneIds = new Set(getZonesForRegion(regionId).map((zone) => zone.id))
  return RELIC_DROPS.filter((drop) => drop.zoneIds.some((zoneId) => zoneIds.has(zoneId)))
}

export function getRegionsForJob(jobId: string): Region[] {
  const job = getJob(jobId)
  if (!job) return []

  const regionIds = new Set(
    job.zoneIds
      .map((zoneId) => getZone(zoneId)?.regionId)
      .filter((regionId): regionId is string => Boolean(regionId)),
  )
  return REGIONS.filter((region) => regionIds.has(region.id))
}
