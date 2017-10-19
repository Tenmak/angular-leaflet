declare const L: any;
import 'leaflet.markercluster';
import { LeafletService } from './../leaflet-map.service';
import { GlobalMapService } from '../../../maps.service';

/**
 * Initialize the MarkerCluster clusters
 * @param {L.Map} map
 * @param {LeafletService} mapService the current leaflet map service
 */
export function initMarkerCluster(map: L.Map, mapService: LeafletService) {
  // Set the ClusterMarkerLayer
  const cluster = L.markerClusterGroup();
  cluster.addLayer(mapService.markersLayer);
  map.addLayer(cluster);

  const clusterMap: Map<number, number[]> = new Map<number, number[]>();

  // Manage additionnal popups layer click
  const labelsLayerCheckbox = ($('*:checkbox').first());
  labelsLayerCheckbox.on('click', () => {
    if (labelsLayerCheckbox.is(':checked')) {
      // Manages cluster context and popups closure when clusters are already made
      setClusterMarkersContext(map, mapService, [], clusterMap);
    }
  });

  // When a zoom occured and could trigger marker clusterization
  cluster.on('animationend', () => {
    // Which clusters are currently displayed
    const displayedClusters: number[] = [];

    setClusterMarkersContext(map, mapService, displayedClusters, clusterMap);

    // No need to do any actions if the layerControl of popups is not activated.
    const labelsLayerCheckboxValue = labelsLayerCheckbox.is(':checked');
    if (labelsLayerCheckboxValue) {
      let allMapMarkers: L.Marker[] = mapService.markersLayer.getLayers() as L.Marker[];
      // Get the markers that are not included in the displayed clusters
      allMapMarkers = allMapMarkers.filter(markers => {
        let result = true;
        displayedClusters.forEach(displayedCluster => {
          const markersIds = clusterMap.get(displayedCluster);
          if (markersIds.includes(markers['_leaflet_id'])) {
            result = false;
          }
        });
        return result;
      });

      // Open the popup of those markers
      allMapMarkers.forEach(marker => {
        const markerId: number = marker['_leaflet_id'];
        const popup: L.Popup = mapService.markersAdditionnalPopupsMap.get(markerId);
        if (!popup.isOpen()) {
          // WARNING : Dependent on L.PopupOption : 'autoClose : false'
          map.openPopup(popup);
        }
      });

    }
  });
}

/**
 * Sets the map cluster context for the LayerControl
 * @param {L.Map} map
 * @param {LeafletService} mapService the current map service
 * @param {number[]} displayedClusters the current displayed clusters
 * @param {Map<number, number[]>} clusterMap the map of clusters and markers
 */
function setClusterMarkersContext(map: L.Map, mapService: LeafletService, displayedClusters: number[], clusterMap: Map<number, number[]>) {
  const layers = GlobalMapService.jsonToArray(map['_layers']);
  layers.forEach(layer => {
    // if layer is a markerCluster
    if (layer.getChildCount) {
      // The current cluster browsed
      const clusterId: number = layer['_leaflet_id'];
      displayedClusters.push(clusterId);
      // Stores the collapsed marker ids of the current cluster
      const clusteredMarkersIds: number[] = [];
      const markers: L.Marker[] = layer.getAllChildMarkers();
      markers.forEach(marker => {
        const markerId: number = marker['_leaflet_id'];
        clusteredMarkersIds.push(markerId);
        // Get the Additionnal popup reference through the service
        const popup: L.Popup = mapService.markersAdditionnalPopupsMap.get(markerId);
        // Close the popups for each clustered marker
        map.closePopup(popup);
      });
      // Indicates which cluster contains which markers Ids (and thus which popup to hide)
      clusterMap.set(clusterId, clusteredMarkersIds);
    }
  });
}
