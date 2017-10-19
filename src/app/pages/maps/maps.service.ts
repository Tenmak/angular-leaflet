import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Headers, RequestOptions, Http } from '@angular/http';
// import 'rxjs/add/operator/map'

import { MapConfig, Marker } from './maps.interface';

@Injectable()
export class GlobalMapService {
  private _mapLoaderSubject: Subject<boolean>;
  private _baseLayerSubject: Subject<L.TileLayer>;
  private _mainMapConfigSubject: Subject<boolean>;

  private _markersData: Marker[];
  private _markersLayer: L.LayerGroup;
  private _mainMapId: number;
  private _mainMapStateChanged = false;
  private _mapsConfig: Map<number, MapConfig>;

  mapLoader$: Observable<boolean>;
  baseLayer$: Observable<L.TileLayer>;
  mainMapConfig$: Observable<boolean>;

  static jsonToArray(jsonObject: any): any[] {
    const result: Object[] = [];
    const keys = Object.keys(jsonObject);
    keys.forEach((key) => {
      result.push(jsonObject[key]);
    });
    return result;
  }

  constructor(
    private http: Http,
  ) {
    this._mapLoaderSubject = new Subject<boolean>();
    this.mapLoader$ = this._mapLoaderSubject.asObservable();
    this.mapLoader = false;

    this._baseLayerSubject = new Subject<L.TileLayer>();
    this.baseLayer$ = this._baseLayerSubject.asObservable();

    this._mainMapConfigSubject = new Subject<boolean>();
    this.mainMapConfig$ = this._mainMapConfigSubject.asObservable();
  }

  /**
   * Resolves markers when routing to the MapsModule
   */
  getMarkers(): Observable<void> {
    return this.http
      .get('assets/mock/leaflet.json')
      .map(res => {
        const markers: Marker[] = res.json();
        this.markersData = markers;
      });
  }

  // Marker data resolved beforehand for the map
  get markersData(): Marker[] {
    return this._markersData;
  }
  set markersData(value: Marker[]) {
    this._markersData = value;
  }

  // Loader for the mini-maps
  set mapLoader(value: boolean) {
    this._mapLoaderSubject.next(value);
  }
  // BaseLayer loader for the mini-maps
  set baseLayer(value: L.TileLayer) {
    this._baseLayerSubject.next(value);
  }

  // Layer containing all the markers
  get markersLayer(): L.LayerGroup {
    return this._markersLayer;
  }
  set markersLayer(value: L.LayerGroup) {
    this._markersLayer = value;
  }

  // Manage mini-map configuration swaps
  get mapsConfig(): Map<number, MapConfig> {
    if (!this._mapsConfig) {
      this._mapsConfig = new Map<number, MapConfig>();
    }
    return this._mapsConfig;
  }

  /**
   * Maps the base map configuration for a given map (center + zoom) to its leaflet_id
   * @param map Leaflet map
   * @param mainMap boolean indicating if it's the main map or not
   */
  registerCurrentMapConfig(map: L.Map, mainMap?: boolean): void {
    const mapId: number = map['_leaflet_id'];
    const mapConfig: MapConfig = {
      center: map.getCenter(),
      zoom: map.getZoom(),
      name: map['name']
    };

    // Sets the mainMap Leaflet ID
    if (mainMap) {
      // Reset the current mapConfig if the MapsModule gets unloaded
      if (this.mapsConfig.size > 0) {
        this._mapsConfig = new Map<number, MapConfig>();
      }
      this._mainMapId = mapId;
    }

    this.mapsConfig.set(mapId, mapConfig);
  }

  /**
   * Switches the map configuration between the main map and the given mini-map
   * @param miniMap Mini Leaflet Map
   */
  switchMapAndMiniMapConfig(miniMap: L.Map) {
    // Get main map config
    const mainMapId = this._mainMapId;
    const miniMapId: number = miniMap['_leaflet_id'];
    const mainMapConfig = this.mapsConfig.get(mainMapId);
    const miniMapConfig = this.mapsConfig.get(miniMapId);

    this.mapsConfig.set(mainMapId, miniMapConfig);
    this.mapsConfig.set(miniMapId, mainMapConfig);

    this.updateMapView(miniMap);

    this._mainMapStateChanged = !this._mainMapStateChanged;
    this._mainMapConfigSubject.next(this._mainMapStateChanged);
  }

  /**
   * Update the Map of configuration for each leaflet map
   * @param map current map to update with the global configuration
   */
  updateMapView(map: L.Map) {
    const mapId: number = map['_leaflet_id'];
    const newMapConfig = Object.assign({}, this.mapsConfig.get(mapId));

    // Specific cases for each map
    switch (newMapConfig.name) {
      case 'France':
        this.manageZoomOffset(mapId, newMapConfig, 2, 0);
        break;
      case 'La Réunion':
        this.manageZoomOffset(mapId, newMapConfig, 0, 1);
        break;
      case 'Guadeloupe':
        this.manageZoomOffset(mapId, newMapConfig, 0, 1);
        break;
      case 'Mayotte':
        this.manageZoomOffset(mapId, newMapConfig, 0, 1);
        break;
      case 'Martinique':
        this.manageZoomOffset(mapId, newMapConfig, 0, 1);
        break;
      default:
        console.error('Something went wrong when switching maps !')
        break;
    }

    map.setView(newMapConfig.center, newMapConfig.zoom);
  }

  /**
   * Manage zoom offset for the main map and the mini-map
   * @param mapId map leaflet Id
   * @param mapconfig map new configuration
   * @param zoomOffsetMainMap zoom to reduce for the main map
   * @param zoomOffsetMiniMap zoom to add for the mini map
   */
  manageZoomOffset(mapId: number, mapconfig: MapConfig, zoomOffsetMainMap: number, zoomOffsetMiniMap: number) {
    if (mapId === this._mainMapId) {
      mapconfig.zoom += zoomOffsetMiniMap;
    } else {
      mapconfig.zoom -= zoomOffsetMainMap;
    }
  }
}

