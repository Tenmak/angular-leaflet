import * as L from 'leaflet';
import { GlobalMapService } from '../../../maps.service';
import { LeafletService } from './../leaflet-map.service';

/**
 * Initialize the behavior for the popups linked to the markers
 * @param map
 * @param mapService The current map leaflet Service used to retrieve the layers
 * @param state toggle specific behavior or standard (true / false)
 */
export function setPopupHoverMode(map: L.Map, mapService: LeafletService, state: boolean): void {
  const markers: L.Marker[] = mapService.markersLayer.getLayers() as L.Marker[];

  markers.forEach((marker, index) => {
    // Closes already opened popups when the HoverMode is changed
    if (marker.getPopup().isOpen()) {
      marker.closePopup();
    }

    if (state) {
      // Add event listeners
      marker.on('mouseover', function (e) {
        // Already opened with 'click' event
        if (marker.getPopup().isOpen()) {
          return false;
        } else {
          (this as L.Marker).openPopup();
        }
      });

      marker.on('click', (e) => {
        // Prevent map dbl-click zoom
        map.doubleClickZoom.disable();
      });

      marker.on('dblclick', function (e) {
        // Re-enable map zoom on dbl-click
        map.doubleClickZoom.enable();
      });
    } else {
      // Remove event listeners
      marker.off('mouseover');
    }
  });
}

/**
 * Specific way to manage custom popups for each marker, with a custom way to open with events
 * @param mapService GlobalMapService used to persist the markers options and content
 * @param leafletService LeafletService
 * @param layerGroup layer containing the markers and their popups
 */
function managePopupRebinds(mapService: GlobalMapService, leafletService: LeafletService, layerGroup: L.LayerGroup): void {
  // const markers: L.Marker[] = GlobalMapService.jsonToArray(layerGroup.getLayers());
  // const popupContent: any[] = [];
  // const popupOptions: L.PopupOptions[] = [];

  // markers.forEach(marker => {
  //   popupContent.push(marker.getPopup().getContent());
  //   popupOptions.push(marker.getPopup().options);
  // });

  // // Add markers Data to the map
  // leafletService.markersData = {
  //   markers: markers,
  //   popupContent: popupContent,
  //   popupOptions: popupOptions
  // }

  // markers.forEach((marker, index) => {
  //   // Add event listeners
  //   marker.on('mouseover', function (e) {
  //     // Already opened with 'click' event
  //     if (marker.getPopup().isOpen()) {
  //       return false;
  //     } else {
  //       rebindPopup(marker, index, false);
  //       (this as L.Marker).openPopup();
  //     }
  //   });
  //   marker.on('mouseout', function (e) {
  //     // Already opened with 'click' event
  //     if (marker.getPopup().options.closeButton) {
  //       return false;
  //     } else {
  //       (this as L.Marker).closePopup();
  //     }
  //   });
  //   marker.on('click', function (e) {
  //     // Already opened with 'click' event
  //     if (marker.getPopup().options.closeButton) {
  //       (this as L.Marker).closePopup();
  //       rebindPopup(marker, index, false);
  //     } else {
  //       (this as L.Marker).closePopup();
  //       rebindPopup(marker, index, true);
  //       (this as L.Marker).openPopup();
  //     }
  //   });
  // });

  // function rebindPopup(marker: L.Marker, index: number, state: boolean) {
  //   marker.unbindPopup();
  //   const options: L.PopupOptions = leafletService.markersData.popupOptions[index];
  //   options.closeButton = state;
  //   marker.bindPopup(leafletService.markersData.popupContent[index], options);
  // }

  // **** Service part :  ****//

  // import { MarkerData } from './leaflet-map.interface';

  // private _markersData: MarkerData;
  // get markersData(): MarkerData {
  //   return this._markersData;
  // }
  // set markersData(value: MarkerData) {
  //   this._markersData = value;
  // }
}

