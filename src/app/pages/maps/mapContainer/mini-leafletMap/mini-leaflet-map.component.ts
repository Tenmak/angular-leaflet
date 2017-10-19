import { Component, ElementRef, ViewChild, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import * as L from 'leaflet';
import { getDomTomMapOptions } from './conf/dom-tom.conf';

import { GlobalMapService } from './../../maps.service';
import { MiniLeafletMapService } from './mini-leaflet-map.service';


@Component({
  selector: 'mini-leaflet-map',
  templateUrl: './mini-leaflet-map.component.html',
  styleUrls: ['./mini-leaflet-map.component.scss'],
  providers: [MiniLeafletMapService]
})
export class MiniLeafletMapComponent implements OnDestroy {
  display: number;
  @ViewChild('miniMap') mapEl: ElementRef;
  @Input() configIndex: number;
  private map: L.Map;
  private miniMapMarkers: L.LayerGroup = L.layerGroup(null);
  private baseLayer: L.TileLayer;
  private baseLayerSubscription: Subscription;
  private mapLoaderSubscription: Subscription;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private globalMapService: GlobalMapService,
    private miniLeafletMapService: MiniLeafletMapService,
  ) {
    // Listen to baseLayer changes
    this.baseLayerSubscription = this.globalMapService.baseLayer$.subscribe(newBaseLayer => {
      this.changeMiniMapBaseLayer(newBaseLayer);
    });

    // Wait for first map to be loaded and set the context
    this.mapLoaderSubscription = this.globalMapService.mapLoader$.subscribe(state => {
      if (state) {
        this.initMiniMap();
        // Need to manually detect the changes to avoid errors while rendering the map
        this.changeDetector.detectChanges();
      }
    });
  }

  /**
   * Initialize the mini-map after the main map is initialized
   */
  initMiniMap() {
    // Load the map
    if (!this.map) {
      this.map = this.initMap();
      this.globalMapService.registerCurrentMapConfig(this.map, false);
      this.display = this.countMarkersInCurrentMapBounds();

      // Manages markers counter
      // this.map.on('movestart', () => {
      //   this.display = null;
      // });
      this.map.on('moveend', () => {
        this.display = this.countMarkersInCurrentMapBounds();
      });
    }
  }

  /**
   * Initialize the current map leaflet context
   */
  initMap(): L.Map {
    const mapConfig = getDomTomMapOptions(this.configIndex);
    const map = L.map(this.mapEl.nativeElement, {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      dragging: false,
      boxZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      zoomDelta: 0,
      layers: [
        this.baseLayer, // Base layer,
      ],
      zoomControl: false,
    });

    // Sets the name of the mini-map
    map['name'] = mapConfig.name;

    return map;
  }

  /**
   * Switches base layer
   * @param newLayer new Tile Layer to set
   */
  changeMiniMapBaseLayer(newLayer: L.TileLayer) {
    // Creates a new leaflet TileLayer with the same URL from the layer control when selected
    const tileLayerMaxZoom = newLayer.options.maxZoom;
    const tileLayerUrl = newLayer['_url'];
    const tileLayer = L.tileLayer(tileLayerUrl, {
      maxZoom: tileLayerMaxZoom
    });

    // Gets the current baseLayer when it's ready
    if (this.baseLayer) {
      // Delete the current baseLayer
      this.map.removeLayer(this.baseLayer)
      // Add the new one
      this.map.addLayer(tileLayer);
    }
    this.baseLayer = tileLayer;
  }

  countMarkersInCurrentMapBounds(): number {
    const markers: L.Marker[] = this.miniLeafletMapService.markersLayer.getLayers() as L.Marker[];
    const markersContained: boolean[] = [];
    markers.forEach(marker => {
      markersContained.push(this.map.getBounds().contains(marker.getLatLng()));
    })
    return (markersContained.filter(values => values)).length;
  }

  onMiniMapClick() {
    if (this.map) {
      this.globalMapService.switchMapAndMiniMapConfig(this.map);
    } else {
      console.error('The map is missing ! Contact the administrator.')
    }
  }

  ngOnDestroy() {
    this.baseLayerSubscription.unsubscribe();
    this.mapLoaderSubscription.unsubscribe();
  }
}
