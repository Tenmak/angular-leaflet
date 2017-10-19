declare var L: any;
// import * as L from 'leaflet';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';

import { defaultLeafletIconOptions } from './icons.conf';
import { Marker, MarkerConfig } from '../../../maps.interface';

import { LeafletService } from '../leaflet-map.service';
import { GlobalMapService } from '../../../maps.service';
import { LeafletConfigurationService } from '../../../leafletConfiguration.service';

export function getBaseLayers(leafletService: LeafletService) {
  // BaseLayers definition
  const OSM_standard = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  const OSM_black_white = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  const OSM_roads = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  const OSM_cities = L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  const OSM_capitals = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
  Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>`
  });

  const baseLayers: L.Control.LayersObject = {
    'Standard': OSM_standard,
    'Black & White': OSM_black_white,
    'Roads': OSM_roads,
    'Cities': OSM_cities,
    'Capitals': OSM_capitals
  };

  leafletService.baseLayers = baseLayers;
}

export function getOverlays(
  globalMapService: GlobalMapService,
  leafletService: LeafletService,
  leafletConfigurationService: LeafletConfigurationService
) {
  ////// TEMP !!!!
  console.clear();
  ////// END TEMP !!!!

  getMarkersOverlay(globalMapService, leafletConfigurationService);
  const labelsLayer = getMarkersLabelsOverlay(leafletService);

  const overlays: L.Control.LayersObject = {
    // 'Sites': globalMapService.markersLayer,
    'Labels': labelsLayer
  };

  leafletService.overlays = overlays;
}

/**
 * Defines a layerGroup with markers and default icons
 */
function getMarkersOverlay(globalMapService: GlobalMapService, leafletConfigurationService: LeafletConfigurationService) {
  // Overlays definition
  const sites = L.layerGroup(null);

  // Gets data from the service which has been resolved beforehand
  globalMapService.markersData.forEach(markerdata => {
    if (markerdata.isPrimary) {
      // Get the marker external config
      const markerConf = leafletConfigurationService.markersData.primary;
      addCustomMarker(markerdata, markerConf, sites);
    } else {
      // Get the marker external config
      const markerConf = leafletConfigurationService.markersData.secondary;
      addCustomMarker(markerdata, markerConf, sites);
    }
  });

  // Set the overlay in the global map service
  globalMapService.markersLayer = sites;
}

/**
 * Adds a marker with its configuration to a LayerGroup
 * @param markerdata Marker's data (center, popup, ...)
 * @param markerConfig  Marker's configuration (color, shape, ...)
 * @param sites LayerGroup
 */
function addCustomMarker(markerdata: Marker, markerConfig: MarkerConfig, sites: L.LayerGroup) {
  let marker = null;

  // Calls the correct marker constructor (for each config library)
  if (!markerConfig.markerColor) {
    marker = L.icon(markerConfig);
  } else {
    marker = L.AwesomeMarkers.icon(markerConfig);
  }

  // Create the Leaflet Marker
  L.marker(markerdata.center, { icon: marker })
    .bindPopup(markerdata.popup)
    .addTo(sites);
}

/**
 * Defines a layerGroup with labels (additionnal popup) for every marker
 * @param markersLayer layer containing all the markers
 */
function getMarkersLabelsOverlay(leafletService: LeafletService) {
  const markers: L.Marker[] = leafletService.markersLayer.getLayers() as L.Marker[];
  const labelsLayer = L.layerGroup(null);

  // Map containing the markers Ids with the additionnal popup to be linked.
  const markerPopupMap = new Map<number, L.Popup>();

  markers.forEach((marker, index) => {
    // The width / margins are re-defined in the popup-label class
    const popup: L.Popup = L.popup({
      offset: [2, -25],
      autoPan: false,
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      maxWidth: 30,
      maxHeight: 25,
      className: 'popup-label'
    })
      .setLatLng(marker.getLatLng())
      .setContent('ID : ' + (index + 1))
      .addTo(labelsLayer);

    markerPopupMap.set(marker['_leaflet_id'], popup);
  });

  leafletService.markersAdditionnalPopupsMap = markerPopupMap;

  return labelsLayer;
}
