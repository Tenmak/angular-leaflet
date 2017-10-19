declare const L: any;
import 'leaflet-draw/dist/leaflet.draw-src';

import { setPopupHoverMode } from './popupControl.conf';

import { GlobalMapService } from '../../../maps.service';
import { LeafletService } from './../leaflet-map.service';

export function drawPlugin(map: L.Map, mapService: LeafletService) {
  const drawnItems: L.FeatureGroup = L.featureGroup().addTo(map);
  const drawControl = initDrawControl(drawnItems);
  map.addControl(drawControl);

  let editMode = false;
  const editTool = new L.EditToolbar.Edit(map, {
    featureGroup: drawnItems
  });

  // overrideGeometries();

  map.on(L.Draw.Event.CREATED, (geometry: any) => {
    const layer = geometry.layer;
    // Delete last drawn layer before adding the new one.
    drawnItems.clearLayers();
    drawnItems.addLayer(layer);

    // Forces edit mode on event drawn
    editTool.enable();
    editMode = !editMode;

    layer.on('dblclick', (e) => {
      // Re-enable map zoom on dbl-click
      map.doubleClickZoom.enable();
    })

    layer.on('click', (e) => {
      // Prevent map dbl-click zoom
      map.doubleClickZoom.disable();

      // Allow layer edition on click
      if (editMode) {
        editTool.disable();
        editMode = !editMode;
      } else {
        editTool.enable();
        editMode = !editMode;
      }
    });
  });

  map.on(L.Draw.Event.DRAWSTART, () => {
    // Disable editing if currently drawing
    if (editMode) {
      editTool.disable();
      editMode = !editMode;
    }

    // Disable hover behavior
    setPopupHoverMode(map, mapService, false);
  });
  map.on(L.Draw.Event.EDITSTART || L.Draw.Event.EDITRESIZE || L.Draw.Event.EDITMOVE, () => {
    // Enable hover behavior
    setPopupHoverMode(map, mapService, false);
  });
  map.on(L.Draw.Event.EDITSTOP, () => {
    // Enable hover behavior
    setPopupHoverMode(map, mapService, true);
  });

  // map.on(L.Draw.Event.DRAWSTOP, (geometry: any) => {
  // // Stay in drawing mode after finishing drawing a geometry
  // if (geometry.layerType === 'rectangle') {
  //   // new L.Draw.Rectangle(map, drawControl.options.rectangle).enable();
  // }
  // if (geometry.layerType === 'circle') {
  //   // new L.Draw.Circle(map, drawControl.options.circle).enable();
  // }
  // });
}

/**
 * Initialize the Draw Control Toolbar
 * @param drawnItems The FeatureGroup drawn items are sent in
 */
function initDrawControl(drawnItems: L.FeatureGroup): any {
  L.drawLocal.edit.handlers.edit.tooltip = {
    text: null,
    subtext: null
  };

  return new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      edit: false,
      remove: false
    },
    draw: {
      polygon: false,
      polyline: false,
      marker: false,
      circlemarker: false
    }
  });
}

/**
 * Add methods to current Geometry formats from the library
 */
function overrideGeometries(): void {
  // Define contains() method for each geometry
  L.Rectangle.include({
    contains: function (markers: L.Marker[]) {
      const markersContained: boolean[] = [];
      markers.forEach(marker => {
        markersContained.push(this.getBounds().contains(marker.getLatLng()));
      })
      return markersContained;
    }
  });

  L.Circle.include({
    contains: function (markers: L.Marker[]) {
      const markersContained: boolean[] = [];
      markers.forEach(marker => {
        markersContained.push(this.getLatLng().distanceTo(marker.getLatLng()) < this.getRadius());
      })
      return markersContained;
    }
  });
}

/**
 * Temp
 * @param layer
 * @param layerGroup
 */
function checkMarkersContainedInGeometry(layer: any, layerGroup: L.LayerGroup): boolean {
  // Set an array containing all the markers
  const markers: L.Marker[] = GlobalMapService.jsonToArray(layerGroup.getLayers());
  const result: boolean = layer.contains(markers);
  return result;
}



