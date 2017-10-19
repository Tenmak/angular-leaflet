declare const L: any;
import 'leaflet-zoombox';

import { setPopupHoverMode } from './popupControl.conf';
import { LeafletService } from './../leaflet-map.service';

/**
 * Initialize the Zoombox Leaflet Control
 * @param {L.Map} map
 * @param {LeafletService} mapService the current used leaflet service
 */
export function initZoomBox(map, mapService: LeafletService) {
  const control = L.control.extendedZoomBox({ modal: false, mapService: mapService });
  map.addControl(control);
}

/**
 * Extend the existing ZoomBox with custom behavior
 */
L.Control.ExtendedZoomBox = L.Control.ZoomBox.extend({
  options: {
    mapService: null
  },
  onAdd: function (map) {
    this._map = map;
    this._container = L.DomUtil.create('div', 'leaflet-zoom-box-control leaflet-bar');
    this._container.title = this.options.title;
    const link = L.DomUtil.create('a', this.options.className, this._container);
    link.href = '#';

    // Bind to the map's boxZoom handler
    const _origMouseDown = map.boxZoom._onMouseDown;
    map.boxZoom._onMouseDown = function (e) {
      if (e.button === 2) {
        return;  // prevent right-click from triggering zoom box
      }
      _origMouseDown.call(map.boxZoom, {
        clientX: e.clientX,
        clientY: e.clientY,
        which: 1,
        shiftKey: true
      });
    };

    map.on('zoomend', function () {
      if (map.getZoom() === map.getMaxZoom()) {
        L.DomUtil.addClass(link, 'leaflet-disabled');
      } else {
        L.DomUtil.removeClass(link, 'leaflet-disabled');
      }
    }, this);
    // Keep the zoom mode activated or not on zoomend
    if (!this.options.modal) {
      map.on('boxzoomend', this.deactivate, this);
    }

    L.DomEvent
      .on(this._container, 'dblclick', L.DomEvent.stop)
      .on(this._container, 'click', L.DomEvent.stop)
      .on(this._container, 'mousedown', L.DomEvent.stopPropagation)
      .on(this._container, 'click', function () {
        this._active = !this._active;
        if (this._active && map.getZoom() !== map.getMaxZoom()) {
          this.activate();
        } else {
          this.deactivate();
        }
      }, this);

    return this._container;
  },
  activate: function () {
    // Disable the hover behavior on markers
    setPopupHoverMode(this._map, this.options.mapService, false);

    L.DomUtil.addClass(this._container, 'active');
    this._map.dragging.disable();
    this._map.boxZoom.addHooks();
    L.DomUtil.addClass(this._map.getContainer(), 'leaflet-zoom-box-crosshair');
  },
  deactivate: function () {
    // Sets the hover behavior on markers
    setPopupHoverMode(this._map, this.options.mapService, true);

    L.DomUtil.removeClass(this._container, 'active');
    this._map.dragging.enable();
    this._map.boxZoom.removeHooks();
    L.DomUtil.removeClass(this._map.getContainer(), 'leaflet-zoom-box-crosshair');
    this._active = false;
  },
});

/**
 * Provide a new constructor for the extended class
 */
L.control.extendedZoomBox = function (options) {
  return new L.Control.ExtendedZoomBox(options);
};

