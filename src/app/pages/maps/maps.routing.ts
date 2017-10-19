import { Routes, RouterModule, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MapsComponent } from './maps.component';
import { MapContainerComponent } from './mapContainer/mapContainer.component';
// import { LeafletMapComponent } from './leafletMap/leaflet-map.component';

import { GlobalMapService } from './maps.service';

@Injectable()
export class MarkersResolver implements Resolve<void> {
  constructor(private globalMapService: GlobalMapService) { }
  resolve(): Observable<void> {
    if (!this.globalMapService.markersLayer) {
      return this.globalMapService.getMarkers();
    }
  }
}

const routes: Routes = [
  {
    path: '',
    component: MapsComponent,
    children: [
      {
        path: 'leafletmap',
        component: MapContainerComponent,
        resolve: {
          toto: MarkersResolver
        }
      },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
