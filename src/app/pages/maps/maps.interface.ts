export interface MapConfig {
  center: L.LatLngExpression,
  zoom: number,
  name: string
}

export interface Marker {
  isPrimary: boolean,
  center: L.LatLngExpression,
  popup: string
}

export interface MarkerConfig extends L.IconOptions {
  markerColor?: string,
  prefix?: string,
  icon?: string,
  iconColor?: string,
  className?: string
}

export interface LeafletMarkerConfig {
  primary: MarkerConfig,
  secondary: MarkerConfig
}

