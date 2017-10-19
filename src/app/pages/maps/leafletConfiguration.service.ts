import { Injectable } from '@angular/core';

import { defaultLeafletIconOptions } from './mapContainer/leafletMap/conf/icons.conf';
import { LeafletMarkerConfig, MarkerConfig } from './maps.interface';

@Injectable()
export class LeafletConfigurationService {
  private _markerStyles: string[];
  private _markersOptions: MarkerConfig[];
  private _leafletMarkersConfig: LeafletMarkerConfig = {
    primary: null,
    secondary: null
  };

  constructor() {
    // Sets a default marker selected by default
    this._leafletMarkersConfig = {
      primary: defaultLeafletIconOptions,
      secondary: defaultLeafletIconOptions
    }
  }

  // Marker configuration for the leaflet map
  get markersData(): LeafletMarkerConfig {
    return this._leafletMarkersConfig;
  }
  set markersDataPrimary(value: MarkerConfig) {
    this._leafletMarkersConfig.primary = value;
  }
  set markersDataSecondary(value: MarkerConfig) {
    this._leafletMarkersConfig.secondary = value;
  }

  // Markers styles used in the configurator component
  get markerStyles(): string[] {
    return this._markerStyles;
  }
  set markerStyles(value: string[]) {
    this._markerStyles = value;
  }

  // Marker options used in the configurator component
  get markersOptions(): MarkerConfig[] {
    return this._markersOptions;
  }
  set markersOptions(value: MarkerConfig[]) {
    this._markersOptions = value;
  }
}


