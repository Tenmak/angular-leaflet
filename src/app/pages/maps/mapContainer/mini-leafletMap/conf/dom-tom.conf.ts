import { MapConfig } from './../../../maps.interface';

export const configuration: MapConfig[] = [
  {
    name: 'La Réunion',
    center: [-21.12901, 55.5578],
    zoom: 9,
  },
  {
    name: 'Martinique',
    center: [14.6089, -61.0731],
    zoom: 9
  },
  {
    name: 'Mayotte',
    center: [-12.8360, 45.1466],
    zoom: 10
  },
  {
    name: 'Guadeloupe',
    center: [16.1800, -61.5062],
    zoom: 9
  },
]

/**
 * Returns a Map center and zoom
 * @param index index of the wanted configuration (see dom-tom.conf.ts)
 * @return {MapConfig}
 */
export function getDomTomMapOptions(index: number) {
  return configuration[index];
}

