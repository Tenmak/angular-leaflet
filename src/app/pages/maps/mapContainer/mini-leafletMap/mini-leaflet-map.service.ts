import { Injectable } from '@angular/core';

import * as L from 'leaflet';
import { GlobalMapService } from '../../maps.service';

@Injectable()
export class MiniLeafletMapService {
  private _markersLayer: L.LayerGroup;

  constructor(
    private globalMapService: GlobalMapService
  ) { }

  get markersLayer(): L.LayerGroup {
    if (!this._markersLayer) {
      this._markersLayer = L.layerGroup(null);

      // Creates a new layerGroup from the global service
      const markers: L.Marker[] = this.globalMapService.markersLayer.getLayers() as L.Marker[];
      markers.forEach((marker, index) => {
        L.marker(marker.getLatLng(), marker.options)
          .bindPopup(marker.getPopup().getContent())
          .addTo(this._markersLayer);
      });
    }

    return this._markersLayer;
  }
}

