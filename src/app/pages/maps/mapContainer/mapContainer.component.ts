import { Component } from '@angular/core';

import { configuration } from './mini-leafletMap/conf/dom-tom.conf';

@Component({
  templateUrl: './mapContainer.component.html',
  styleUrls: ['./mapContainer.component.scss'],
})
export class MapContainerComponent {
  mapCount = configuration;

  slimOptions = {
    wheelStep: 10,
    alwaysVisible: true,
  }
}
