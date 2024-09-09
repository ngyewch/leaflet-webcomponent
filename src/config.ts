import {Control, GeoJSONOptions, MapOptions, TileLayerOptions, WMSOptions} from 'leaflet';

export interface Configuration {
    options?: MapOptions;
    scaleOptions?: Control.ScaleOptions;
    baseLayers?: LayersControlEntry[];
    overlayLayers?: LayersControlEntry[];
}

export interface LayersControlEntry {
    name: string;
    selected?: boolean;
    config: LayerConfiguration;
}

export type LayerConfiguration = TileLayerConfiguration | TileLayerWMSConfiguration | GeoJSONConfiguration;

export interface TileLayerConfiguration {
    kind: 'TileLayer';
    urlTemplate: string;
    options?: TileLayerOptions;
}

export interface TileLayerWMSConfiguration {
    kind: 'TileLayer.WMS';
    baseUrl: string,
    options: WMSOptions;
}

export interface GeoJSONConfiguration {
    kind: 'GeoJSON';
    id: string,
    fitBounds?: boolean,
    options?: GeoJSONOptions;
}
