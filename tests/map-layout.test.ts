import { describe, expect, it } from 'vitest'
import { clampBubbleCenter, imageBoundsToSimpleCrsBounds } from '../src/domain/mapLayout'

describe('map bubble layout', () => {
  it('keeps the full bubble inside the viewport', () => {
    expect(clampBubbleCenter(
      [10, 490],
      { width: 800, height: 500 },
      { width: 180, height: 140 },
      { horizontal: 10, vertical: 10 },
    )).toEqual([100, 420])
  })

  it('centers a bubble when the viewport is too small for it', () => {
    expect(clampBubbleCenter(
      [0, 0],
      { width: 120, height: 80 },
      { width: 160, height: 100 },
      { horizontal: 10, vertical: 10 },
    )).toEqual([60, 40])
  })

  it('converts image coordinates into Leaflet simple-CRS bounds', () => {
    expect(imageBoundsToSimpleCrsBounds([[0, 584], [2048, 1462]], 2048))
      .toEqual([[586, 0], [1464, 2048]])
  })
})
