import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { JOBS } from '../src/data/jobs'
import { MAP_PLACES, REGIONS, WORLD_MAP_PLACES, ZONES } from '../src/data/maps'
import { RELIC_DROPS } from '../src/data/relicDrops'
import { getJobsForRegion, getJobsForZone, getRegionsForJob, getRelicDropsForZone, getZonesForRegion } from '../src/domain/selectors'

describe('V2 data integrity', () => {
  it('contains the expected core entities with unique identifiers', () => {
    expect(JOBS).toHaveLength(17)
    expect(REGIONS).toHaveLength(8)
    expect(ZONES).toHaveLength(28)
    expect(MAP_PLACES).toHaveLength(12)
    expect(WORLD_MAP_PLACES).toHaveLength(2)
    expect(RELIC_DROPS).toHaveLength(23)
    expect(new Set(JOBS.map((job) => job.id)).size).toBe(JOBS.length)
    expect(new Set(REGIONS.map((region) => region.id)).size).toBe(REGIONS.length)
    expect(new Set(ZONES.map((zone) => zone.id)).size).toBe(ZONES.length)
    expect(new Set(MAP_PLACES.map((place) => place.id)).size).toBe(MAP_PLACES.length)
    expect(new Set(WORLD_MAP_PLACES.map((place) => place.id)).size).toBe(WORLD_MAP_PLACES.length)
  })

  it('keeps every job, region and zone reference valid', () => {
    const zoneIds = new Set(ZONES.map((zone) => zone.id))
    const regionIds = new Set(REGIONS.map((region) => region.id))

    for (const job of JOBS) {
      expect(job.zoneIds.length).toBeGreaterThan(0)
      for (const zoneId of job.zoneIds) expect(zoneIds.has(zoneId)).toBe(true)
      expect(getRegionsForJob(job.id).length).toBeGreaterThan(0)
    }

    for (const region of REGIONS) {
      expect(getZonesForRegion(region.id).length).toBeGreaterThan(0)
      expect(getJobsForRegion(region.id).length).toBeGreaterThan(0)
    }

    for (const zone of ZONES) {
      expect(regionIds.has(zone.regionId)).toBe(true)
      expect(getZonesForRegion(zone.regionId).map((candidate) => candidate.id)).toContain(zone.id)
    }

    for (const place of MAP_PLACES) expect(regionIds.has(place.regionId)).toBe(true)
  })

  it('keeps bidirectional selectors consistent', () => {
    for (const zone of ZONES) {
      for (const job of getJobsForZone(zone.id)) expect(job.zoneIds).toContain(zone.id)
    }

    for (const job of JOBS) {
      for (const region of getRegionsForJob(job.id)) {
        expect(getJobsForRegion(region.id).map((candidate) => candidate.id)).toContain(job.id)
      }
    }
  })

  it('has all current map and icon assets on disk', () => {
    for (const region of REGIONS) {
      expect(existsSync(resolve('public/assets/map/images', region.imageFile))).toBe(true)
    }
    expect(existsSync(resolve('public/assets/map/images/world_00.jpg'))).toBe(true)

    for (const job of JOBS) {
      expect(existsSync(resolve('public/images/job_icon', `${job.name}.png`))).toBe(true)
      expect(existsSync(resolve('public/images/pet_icon', `${job.pet}.png`))).toBe(true)
      expect(existsSync(resolve('public/images/pet_detail', `${job.pet}.jpg`))).toBe(true)
      expect(existsSync(resolve('public/images/weapon_detail', `${job.id}.jpg`))).toBe(true)
      for (const weapon of job.weapons) {
        expect(existsSync(resolve('public/images/weapon_icon', `${weapon}.png`))).toBe(true)
      }
    }

    for (const drop of RELIC_DROPS) {
      expect(existsSync(resolve('public/images/other_icon', drop.type, `${drop.name}.png`))).toBe(true)
    }
  })

  it('keeps relic weapon drops linked to valid zone maps', () => {
    const zoneIds = new Set(ZONES.map((zone) => zone.id))
    for (const drop of RELIC_DROPS) {
      expect(drop.zoneIds.length).toBeGreaterThan(0)
      for (const zoneId of drop.zoneIds) {
        expect(zoneIds.has(zoneId)).toBe(true)
        expect(getRelicDropsForZone(zoneId).map((candidate) => candidate.id)).toContain(drop.id)
      }
    }

    expect(getRelicDropsForZone('库尔札斯西部高地').map((drop) => drop.name))
      .toEqual(['流光冰之水晶', '烦恼的记忆晶块'])
  })

})
