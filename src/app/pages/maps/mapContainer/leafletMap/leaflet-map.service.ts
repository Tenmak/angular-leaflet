import { Injectable } from '@angular/core';

import * as L from 'leaflet';
import { GlobalMapService } from '../../maps.service';

@Injectable()
export class LeafletService {
  private _baseLayers: L.Control.LayersObject;
  private _overlays: L.Control.LayersObject;
  private _markersLayer: L.LayerGroup;
  private _markersAdditionnalPopupsMap: Map<number, L.Popup>;

  constructor(
    private globalMapService: GlobalMapService
  ) { }

  get baseLayers(): L.Control.LayersObject {
    return this._baseLayers;
  }
  set baseLayers(value: L.Control.LayersObject) {
    this._baseLayers = value;
  }

  get overlays(): L.Control.LayersObject {
    return this._overlays;
  }
  set overlays(value: L.Control.LayersObject) {
    this._overlays = value;
  }

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

  get markersAdditionnalPopupsMap(): Map<number, L.Popup> {
    return this._markersAdditionnalPopupsMap;
  }
  set markersAdditionnalPopupsMap(value: Map<number, L.Popup>) {
    this._markersAdditionnalPopupsMap = value;
  }
}

