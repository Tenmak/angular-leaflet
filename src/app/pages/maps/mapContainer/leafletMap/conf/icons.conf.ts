import * as L from 'leaflet';
declare var require: any;

/**
* Fixes leaflet image loading issue with angular
* @see https://github.com/Leaflet/Leaflet/issues/4968
*/
export const defaultLeafletIconOptions: L.IconOptions = {
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
}
