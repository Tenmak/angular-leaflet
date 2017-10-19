import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import * as L from 'leaflet';
import { getBaseLayers, getOverlays } from './conf/layers.conf';
import { drawPlugin } from './conf/tools.conf';
import { initZoomBox } from './conf/zoombox.conf';
import { setPopupHoverMode } from './conf/popupControl.conf';
import { initMarkerCluster } from './conf/markercluster.conf';

import { GlobalMapService } from './../../maps.service';
import { LeafletService } from './leaflet-map.service';
import { LeafletConfigurationService } from '../../leafletConfiguration.service';

@Component({
  selector: 'leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss'],
  providers: [LeafletService]
})
export class LeafletMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapEl: ElementRef;
  private map: L.Map;
  private mainMapConfigSubscription: Subscription;

  constructor(
    private globalMapService: GlobalMapService,
    private leafletService: LeafletService,
    private leafletConfigurationService: LeafletConfigurationService
  ) {
    // Listen to MapConfiguration changes
    this.mainMapConfigSubscription = this.globalMapService.mainMapConfig$.subscribe(state => {
      this.globalMapService.updateMapView(this.map);
    });
  }

  ngOnInit() {
    this.map = this.initMap();

    // Clusters
    initMarkerCluster(this.map, this.leafletService);
    // Custom popups behavior
    setPopupHoverMode(this.map, this.leafletService, true);
    // ZoomBox Control
    initZoomBox(this.map, this.leafletService);
    // Leaflet-Draw Toolbar
    drawPlugin(this.map, this.leafletService);
  }

  ngAfterViewInit() {
    this.setMapEvents(this.map);
  }

  initMap(): L.Map {
    getBaseLayers(this.leafletService);
    getOverlays(this.globalMapService, this.leafletService, this.leafletConfigurationService);

    const map = L.map(this.mapEl.nativeElement, {
      center: [46.66872, 3.05419],
      zoom: 6,
      layers: [
        this.leafletService.baseLayers['Standard'], // BaseLayer
      ],
      attributionControl: false
    });
    map['name'] = 'France';

    // Set the hooks with the mini-map views
    this.globalMapService.registerCurrentMapConfig(map, true);
    // Add the Leaflet LayerControl
    L.control.layers(this.leafletService.baseLayers, this.leafletService.overlays).addTo(map);
    // Set the attribution control elsewhere
    L.control.attribution({ position: 'bottomleft' }).addTo(map);

    return map;
  }

  setMapEvents(map: L.Map) {
    // Initialize the global selected baseLayer
    this.globalMapService.baseLayer = this.leafletService.baseLayers['Standard'] as L.TileLayer;

    // Tells the other map to load
    this.globalMapService.mapLoader = true;

    // Notifies the global map service when a baseLayer has changed (leaflet event)
    map.on('baselayerchange', (selectedBaseLayer: L.LayersControlEvent) => {
      this.globalMapService.baseLayer = selectedBaseLayer.layer as L.TileLayer;
    })
  }

  ngOnDestroy() {
    this.mainMapConfigSubscription.unsubscribe();
  }
}
