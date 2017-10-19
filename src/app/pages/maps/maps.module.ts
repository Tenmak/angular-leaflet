import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { NgaModule } from '../../theme/nga.module';

import { routing, MarkersResolver } from './maps.routing';
import { MapsComponent } from './maps.component';
import { MapContainerComponent } from './mapContainer/mapContainer.component';
import { LeafletMapComponent } from './mapContainer/leafletMap/leaflet-map.component';
import { MiniLeafletMapComponent } from './mapContainer/mini-leafletMap/mini-leaflet-map.component';

import { GlobalMapService } from './maps.service';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing
  ],
  declarations: [
    MapsComponent,
    MapContainerComponent,
    LeafletMapComponent,
    MiniLeafletMapComponent
  ],
  providers: [
    GlobalMapService,
    MarkersResolver
  ]
})
export class MapsModule { }
