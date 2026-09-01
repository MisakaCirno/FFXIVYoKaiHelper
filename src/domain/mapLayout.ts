import type { ImageBounds, Point } from './types'

export interface ViewportSize {
  readonly width: number
  readonly height: number
}

export interface BubbleSize {
  readonly width: number
  readonly height: number
}

export interface ViewportInsets {
  readonly horizontal: number
  readonly vertical: number
}

export type SimpleCrsBounds = [[number, number], [number, number]]

function clampAxis(value: number, viewportSize: number, contentSize: number, inset: number) {
  const minimum = inset + contentSize / 2
  const maximum = viewportSize - inset - contentSize / 2
  if (minimum > maximum) return viewportSize / 2
  return Math.max(minimum, Math.min(maximum, value))
}

export function clampBubbleCenter(
  point: Point,
  viewport: ViewportSize,
  bubble: BubbleSize,
  insets: ViewportInsets,
): Point {
  return [
    clampAxis(point[0], viewport.width, bubble.width, insets.horizontal),
    clampAxis(point[1], viewport.height, bubble.height, insets.vertical),
  ]
}

export function imageBoundsToSimpleCrsBounds(bounds: ImageBounds, mapSize: number): SimpleCrsBounds {
  const [[left, top], [right, bottom]] = bounds
  return [
    [mapSize - bottom, left],
    [mapSize - top, right],
  ]
}
