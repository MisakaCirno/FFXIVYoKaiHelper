<script setup lang="ts">
import L, { type ImageOverlay, type Map as LeafletMap, type Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MAP_BOUNDS, MAP_SIZE, REGIONS, WORLD_MAP, WORLD_MAP_PLACES } from '../../data/maps'
import { clampBubbleCenter, imageBoundsToSimpleCrsBounds } from '../../domain/mapLayout'
import { getJobsForRegion, getJobsForZone, getMapPlacesForRegion, getRegion, getRelicDropsForRegion, getRelicDropsForZone, getZonesForRegion } from '../../domain/selectors'
import type { ImageBounds, MapLabelDirection, Point } from '../../domain/types'
import { assetUrl } from '../../services/assets'
import { placeLabelWidth, renderJobButtons, renderPlaceName, renderRelicDropIcons, renderRelicDropSummary } from './mapMarkerPresentation'

const props = defineProps<{
  selectedRegionId: string | null
  selectedJobId: string | null
  selectedZoneId: string | null
  completedJobIds: readonly string[]
}>()

const emit = defineEmits<{
  'select-region': [regionId: string]
  'select-job': [jobId: string]
  'select-zone': [zoneId: string]
}>()

const mapElement = ref<HTMLElement | null>(null)
const MAP_IMAGE_VERSION = '20260901-baked-2'
let map: LeafletMap | null = null
let imageLayer: ImageOverlay | null = null
let markerLayer: L.LayerGroup | null = null
let resizeObserver: ResizeObserver | null = null
let resizeRenderTimer: number | undefined

const toLatLng = ([x, y]: Point): L.LatLngExpression => [2048 - y, x]

function directionalIconAnchor(width: number, height: number, direction: MapLabelDirection): L.PointExpression {
  if (direction === 'top') return [width / 2, height]
  if (direction === 'right') return [0, height / 2]
  if (direction === 'bottom') return [width / 2, 0]
  return [width, height / 2]
}

function keepLabelInView(point: L.LatLngExpression, width: number, height: number): L.LatLngExpression {
  if (!map || !mapElement.value) return point
  const containerPoint = map.latLngToContainerPoint(point)
  const compactInset = window.matchMedia('(max-width: 700px)').matches ? 64 : 10
  const [x, y] = clampBubbleCenter(
    [containerPoint.x, containerPoint.y],
    { width: mapElement.value.clientWidth, height: mapElement.value.clientHeight },
    { width, height },
    { horizontal: compactInset, vertical: 10 },
  )
  return map.containerPointToLatLng(L.point(x, y))
}

function jobButtons(jobIds: readonly string[]) {
  return renderJobButtons(jobIds, {
    selectedJobId: props.selectedJobId,
    completedJobIds: new Set(props.completedJobIds),
  })
}

function attachMarker(point: L.LatLngExpression, icon: L.DivIcon, zIndexOffset = 1000): Marker {
  const marker = L.marker(point, { icon, keyboard: false, zIndexOffset })
  return marker.addTo(markerLayer!)
}

function renderWorldMarkers() {
  if (!markerLayer) return

  for (const region of REGIONS) {
    const jobs = getJobsForRegion(region.id)
    const relicDrops = getRelicDropsForRegion(region.id)
    const columns = Math.max(1, Math.min(5, jobs.length))
    const rows = Math.max(1, Math.ceil(jobs.length / columns))
    const detailWidth = 24 + columns * 30
    const width = Math.max(placeLabelWidth(region.name), 132, detailWidth)
    const detailHeight = 12 + rows * 28 + (relicDrops.length ? 20 : 0)
    const height = 34 + detailHeight
    const regionPoint = toLatLng(region.worldAnchor)
    const html = `<div class="map-place-bubble has-details" style="--job-columns:${columns}">
      ${renderPlaceName(region.name, { type: 'region', id: region.id })}
      <div class="map-place-details">
        <div class="map-place-details__jobs">${jobButtons(jobs.map((job) => job.id))}</div>
        ${relicDrops.length ? `<div class="map-place-details__relic-summary">${renderRelicDropSummary(relicDrops)}</div>` : ''}
      </div>
    </div>`
    attachMarker(regionPoint, L.divIcon({
      className: 'map-place-bubble-host', html, iconSize: [width, height],
      iconAnchor: directionalIconAnchor(width, height, region.worldLabelDirection),
    }))
  }

  for (const place of WORLD_MAP_PLACES) {
    const width = placeLabelWidth(place.name)
    const height = 34
    const html = `<div class="map-place-bubble is-static">${renderPlaceName(place.name)}</div>`
    attachMarker(toLatLng(place.mapAnchor), L.divIcon({
      className: 'map-place-bubble-host', html, iconSize: [width, height],
      iconAnchor: directionalIconAnchor(width, height, place.labelDirection),
    }), 600)
  }
}

function renderRegionMarkers() {
  if (!markerLayer || !props.selectedRegionId) return

  for (const place of getMapPlacesForRegion(props.selectedRegionId)) {
    const width = placeLabelWidth(place.name)
    const height = 34
    const labelPoint = keepLabelInView(toLatLng(place.mapAnchor), width, height)
    const html = `<div class="map-place-bubble is-static">${renderPlaceName(place.name)}</div>`
    attachMarker(labelPoint, L.divIcon({
      className: 'map-place-bubble-host', html, iconSize: [width, height], iconAnchor: [width / 2, height / 2],
    }), 600)
  }

  for (const zone of getZonesForRegion(props.selectedRegionId)) {
    const jobs = getJobsForZone(zone.id)
    const relicDrops = getRelicDropsForZone(zone.id)
    const hasDetails = jobs.length > 0 || relicDrops.length > 0
    const columns = Math.max(jobs.length, relicDrops.length)
    const detailWidth = 24 + Math.min(5, Math.max(1, columns)) * 30
    const width = Math.max(placeLabelWidth(zone.name), hasDetails ? detailWidth : 0)
    const detailHeight = hasDetails
      ? 12 + (jobs.length ? 28 : 0) + (relicDrops.length ? 31 : 0)
      : 0
    const height = 34 + detailHeight
    const labelPoint = keepLabelInView(toLatLng(zone.mapAnchor), width, height)
    const html = `<div class="map-place-bubble${hasDetails ? ' has-details' : ''}">
      ${renderPlaceName(zone.name, { type: 'zone', id: zone.id }, props.selectedZoneId === zone.id)}
      ${hasDetails ? `<div class="map-place-details">
        ${jobs.length ? `<div class="map-place-details__jobs is-inline">${jobButtons(jobs.map((job) => job.id))}</div>` : ''}
        ${relicDrops.length ? `<div class="map-place-details__relics">${renderRelicDropIcons(relicDrops)}</div>` : ''}
      </div>` : ''}
    </div>`
    attachMarker(labelPoint, L.divIcon({
      className: 'map-place-bubble-host', html, iconSize: [width, height], iconAnchor: [width / 2, height / 2],
    }))
  }
}

function renderMarkers() {
  if (!markerLayer) return
  markerLayer.clearLayers()
  if (props.selectedRegionId) renderRegionMarkers()
  else renderWorldMarkers()
}

function currentViewBounds(): ImageBounds {
  return props.selectedRegionId ? MAP_BOUNDS : WORLD_MAP.viewBounds
}

function resetView(viewBounds = currentViewBounds()) {
  if (!map || !mapElement.value) return
  map.invalidateSize({ animate: false })
  map.fitBounds(imageBoundsToSimpleCrsBounds(viewBounds, MAP_SIZE), {
    animate: false,
    padding: [2, 2],
  })
}

function updateMap() {
  if (!map) return
  const mapConfig = props.selectedRegionId ? getRegion(props.selectedRegionId) : WORLD_MAP
  if (!mapConfig) return
  imageLayer?.remove()
  imageLayer = L.imageOverlay(
    assetUrl(`assets/map/images/${mapConfig.imageFile}?v=${MAP_IMAGE_VERSION}`),
    imageBoundsToSimpleCrsBounds(MAP_BOUNDS, MAP_SIZE),
    { interactive: false },
  ).addTo(map)
  imageLayer.bringToBack()
  resetView()
  renderMarkers()
}

function handleMapClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target : null
  const jobButton = target?.closest<HTMLElement>('[data-map-job]')
  if (jobButton?.dataset.mapJob) {
    event.stopPropagation()
    emit('select-job', jobButton.dataset.mapJob)
    return
  }
  const zoneButton = target?.closest<HTMLElement>('[data-map-zone]')
  if (zoneButton?.dataset.mapZone) {
    event.stopPropagation()
    emit('select-zone', zoneButton.dataset.mapZone)
    return
  }
  const regionButton = target?.closest<HTMLElement>('[data-map-region]')
  if (regionButton?.dataset.mapRegion) {
    event.stopPropagation()
    emit('select-region', regionButton.dataset.mapRegion)
  }
}

onMounted(() => {
  if (!mapElement.value) return
  map = L.map(mapElement.value, {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 1,
    zoomSnap: 0.25,
    maxBounds: [[-256, -256], [2304, 2304]],
    maxBoundsViscosity: 0.85,
    zoomControl: true,
    scrollWheelZoom: true,
  })
  markerLayer = L.layerGroup().addTo(map)
  map.attributionControl.addAttribution('地图素材 &copy; SQUARE ENIX')
  map.on('zoomend', renderMarkers)
  mapElement.value.addEventListener('click', handleMapClick)
  resizeObserver = new ResizeObserver(() => {
    map?.invalidateSize({ animate: false })
    window.clearTimeout(resizeRenderTimer)
    resizeRenderTimer = window.setTimeout(() => {
      resetView()
      renderMarkers()
    }, 260)
  })
  resizeObserver.observe(mapElement.value)
  updateMap()
})

watch(() => props.selectedRegionId, async () => {
  await nextTick()
  updateMap()
})
watch(() => [props.selectedJobId, props.selectedZoneId, props.completedJobIds], renderMarkers, { deep: true })

onBeforeUnmount(() => {
  window.clearTimeout(resizeRenderTimer)
  resizeObserver?.disconnect()
  mapElement.value?.removeEventListener('click', handleMapClick)
  map?.remove()
  map = null
})
</script>

<template>
  <div ref="mapElement" class="map-stage yokai-map" aria-label="妖怪手表与武器素材掉落地图"></div>
</template>
