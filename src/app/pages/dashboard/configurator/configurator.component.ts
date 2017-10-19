import { Component, OnInit } from '@angular/core';

import { defaultLeafletIconOptions } from './../../maps/mapContainer/leafletMap/conf/icons.conf';
import { MarkerConfig, LeafletMarkerConfig } from 'app/pages/maps/maps.interface';

import { LeafletConfigurationService } from '../../maps/leafletConfiguration.service';

@Component({
  selector: 'configurator',
  styleUrls: ['./configurator.component.scss'],
  templateUrl: './configurator.component.html'
})
export class ConfiguratorComponent implements OnInit {
  radioChoices: Map<MarkerConfig, string>;

  constructor(
    private leafletConfigurationService: LeafletConfigurationService
  ) { }

  ngOnInit() {
    // Avoid re-setting the Map to get new Object references
    if (!this.leafletConfigurationService.markersOptions || !this.leafletConfigurationService.markerStyles) {
      this.setMarkersDisplay();
      this.leafletConfigurationService.markersOptions = Array.from(this.radioChoices.keys());
      this.leafletConfigurationService.markerStyles = Array.from(this.radioChoices.values());
    }
  }

  /**
   * Initialize the choice of markers to be displayed
   */
  setMarkersDisplay() {
    this.radioChoices = new Map<MarkerConfig, string>();
    this.radioChoices.set(
      this.setMarkerConfig(null),
      'default-leaflet leaflet-default-icon-path'
    );
    this.radioChoices.set(
      this.setMarkerConfig('red'),
      'default-display awesome-marker awesome-marker-icon-red'
    );
    this.radioChoices.set(
      this.setMarkerConfig('blue'),
      'default-display awesome-marker awesome-marker-icon-blue'
    );
    this.radioChoices.set(
      this.setMarkerConfig('green'),
      'default-display awesome-marker awesome-marker-icon-green awesome-marker-square'
    );
    this.radioChoices.set(
      this.setMarkerConfig('orange'),
      'default-display awesome-marker awesome-marker-icon-orange awesome-marker-square'
    );
  }

  /**
   * Sets a basic MarkerConfig with a color
   * @param color
   */
  setMarkerConfig(color: string): MarkerConfig {
    // Empty object
    let markerConfig: MarkerConfig = {
      iconUrl: null,
      markerColor: null
    };

    if (color == null) {
      // Leaflet base marker case
      markerConfig = defaultLeafletIconOptions;
    } else {
      // Awesome marker case
      markerConfig.markerColor = color;
    }

    // TEMPORARY !!
    if (color === 'orange' || color === 'green') {
      markerConfig.className = 'awesome-marker awesome-marker-square';
    }

    return markerConfig;
  }

  /**
   * Gets the icon classes to be displayed for each radio-button
   * @param index index in the Array
   */
  getMarkerStyle(index: number): string {
    return this.leafletConfigurationService.markerStyles[index];
  }

  /**
   * On radio value change
   * @param value Marker Config selected
   * @param type Primary / Secondary
   */
  onMarkerChange(value: MarkerConfig, type: string) {
    if (type === 'primary') {
      this.leafletConfigurationService.markersDataPrimary = value;
    } else {
      this.leafletConfigurationService.markersDataSecondary = value;
    }
  }
}
