export type JobRole = 'tank' | 'melee' | 'ranged' | 'caster' | 'healer'

export type RelicType = 'guwu' | 'hunwu' | 'yiwu'

export type Point = readonly [x: number, y: number]

export type ImageBounds = readonly [topLeft: Point, bottomRight: Point]

export type MapLabelDirection = 'top' | 'right' | 'bottom' | 'left'

export interface Job {
  readonly id: string
  readonly name: string
  readonly role: JobRole
  readonly pet: string
  readonly weapons: readonly string[]
  readonly zoneIds: readonly string[]
}

export interface RelicDrop {
  readonly id: string
  readonly name: string
  readonly type: RelicType
  readonly zoneIds: readonly string[]
}

export interface Zone {
  readonly id: string
  readonly name: string
  readonly regionId: string
  readonly mapAnchor: Point
}

export interface MapPlace {
  readonly id: string
  readonly name: string
  readonly regionId: string
  readonly mapAnchor: Point
}

export interface Region {
  readonly id: string
  readonly name: string
  readonly imageFile: string
  readonly worldAnchor: Point
  readonly worldLabelDirection: MapLabelDirection
}

export interface WorldMapPlace {
  readonly id: string
  readonly name: string
  readonly mapAnchor: Point
  readonly labelDirection: MapLabelDirection
}

export interface WorldMapConfig {
  readonly id: '艾欧泽亚'
  readonly imageFile: string
  readonly viewBounds: ImageBounds
}

export interface ProgressState {
  readonly version: 2
  readonly completedJobIds: readonly string[]
}
