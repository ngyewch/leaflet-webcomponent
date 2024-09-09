import {LitElement, html, unsafeCSS} from 'lit';
import {customElement, query, queryAssignedElements} from 'lit/decorators.js';
import {
    Control, DomUtil,
    GeoJSON,
    GeoJSONOptions,
    Layer,
    Map,
    MapOptions,
    TileLayer,
    TileLayerOptions,
    WMSOptions
} from 'leaflet';
import {Feature, GeoJsonObject} from 'geojson';
// @ts-ignore
import leafletCss from 'leaflet/dist/leaflet.css?inline';

interface Configuration {
    options?: MapOptions;
    scaleOptions?: Control.ScaleOptions;
    baseLayers?: LayersControlEntry[];
    overlayLayers?: LayersControlEntry[];
}

interface LayersControlEntry {
    name: string;
    selected?: boolean;
    config: LayerConfiguration;
}

type LayerConfiguration = TileLayerConfiguration | TileLayerWMSConfiguration | GeoJSONConfiguration;

interface TileLayerConfiguration {
    kind: 'TileLayer';
    urlTemplate: string;
    options?: TileLayerOptions;
}

interface TileLayerWMSConfiguration {
    kind: 'TileLayer.WMS';
    baseUrl: string,
    options: WMSOptions;
}

interface GeoJSONConfiguration {
    kind: 'GeoJSON';
    id: string,
    fitBounds?: boolean,
    options?: GeoJSONOptions;
}

@customElement('leaflet-map')
export class LeafletMapElement extends LitElement {
    public static styles = unsafeCSS(leafletCss);

    @query('#map')
    private mapElement!: HTMLDivElement;

    @queryAssignedElements({slot: ''})
    private scriptElements!: Array<HTMLElement>;

    private map: Map | undefined;

    protected render() {
        return html`
            <div id="map" style="width: 100%; height: 100%;">
            </div>
            <div style="display: none;">
                <slot @slotchange=${this.handleSlotChange}></slot>
            </div>
        `;
    }

    private handleSlotChange() {
        if (this.map) {
            this.map.remove();
            this.map = undefined;
        }

        this.loadData('application/json')
            .then(jsonString => {
                try {
                    const config = JSON.parse(jsonString) as Configuration;

                    const map = new Map(this.mapElement, config.options);
                    this.map = map;

                    let layerCount = 0;
                    const layersControl = new Control.Layers();

                    if (config.baseLayers) {
                        config.baseLayers.forEach(entry => {
                            const layer = this.newLayer(entry.config);
                            if (layer !== undefined) {
                                layer.addTo(map);
                                layersControl.addBaseLayer(layer, entry.name);
                                layerCount++;
                            }
                        });
                    }
                    if (config.overlayLayers) {
                        config.overlayLayers.forEach(entry => {
                            const layer = this.newLayer(entry.config);
                            if (layer) {
                                if (entry.selected) {
                                    layer.addTo(map);
                                }
                                layersControl.addOverlay(layer, entry.name);
                                layerCount++;
                            }
                        });
                    }

                    if (layerCount > 0) {
                        layersControl.addTo(map);

                        const scaleControl = new Control.Scale(config.scaleOptions);
                        scaleControl.addTo(map);
                    }
                } catch (e) {
                    console.error('leaflet-map', this.id, 'error loading map', e);
                }
            })
            .catch(reason => {
                console.error('leaflet-map', this.id, 'error loading configuration', reason);
            });
    }

    private newLayer(config: LayerConfiguration): Layer | undefined {
        switch (config.kind) {
            case 'TileLayer':
                return new TileLayer(config.urlTemplate, config.options);
            case 'TileLayer.WMS':
                return new TileLayer.WMS(config.baseUrl, config.options);
            case 'GeoJSON':
                if (!config.options) {
                    config.options = {};
                }
                config.options.onEachFeature = this.onEachFeature;
                const layer = new GeoJSON(null, config.options);
                if (config.fitBounds) {
                    layer.on('add', () => {
                        if (this.map && config.fitBounds) {
                            this.map.fitBounds(layer.getBounds());
                        }
                    });
                }
                this.loadData('application/geo+json', config.id)
                    .then(json => {
                        try {
                            const o = JSON.parse(json);
                            layer.addData(o as GeoJsonObject);
                        } catch (e) {
                            console.error('leaflet-map', this.id, 'error loading GeoJSON', e);
                        }
                    })
                    .catch(reason => {
                        console.error('leaflet-map', this.id, 'error loading GeoJSON', reason, config.id);
                    });
                return layer;
            default:
                console.error('leaflet-map', this.id, 'unknown layer kind', config);
                return undefined;
        }
    }

    private onEachFeature(feature: Feature, layer: Layer) {
        const tooltip = DomUtil.create('div');
        const table = DomUtil.create('table', undefined, tooltip);
        const thead = DomUtil.create('thead', undefined, table);
        const trHead = DomUtil.create('tr', undefined, thead);
        const thName = DomUtil.create('th', undefined, trHead);
        thName.innerHTML = 'Name';
        const thValue = DomUtil.create('th', undefined, trHead);
        thValue.innerHTML = 'Value';
        const tbody = DomUtil.create('tbody', undefined, table);
        if (feature.properties !== null) {
            for (let key in feature.properties) {
                const value = feature.properties[key];
                const tr = DomUtil.create('tr', undefined, tbody);
                const tdName = DomUtil.create('td', undefined, tr);
                tdName.innerHTML = key;
                const tdValue = DomUtil.create('td', undefined, tr);
                tdValue.innerHTML = value;
            }
        }
        layer.bindTooltip(tooltip);
    }

    private loadData(type: string, id?: string): Promise<string> {
        const scriptElements = this.getScriptElements(type, id);
        if (scriptElements.length === 0) {
            return new Promise((_, reject) => {
                reject(`${type} / ${id} not found`);
            });
        }
        if (scriptElements.length > 1) {
            console.warn('leaflet-map', this.id, 'more than one matching data block found, using first', type, id);
        }
        return this.loadDataFromScript(scriptElements[0]);
    }

    private loadDataFromScript(scriptElement: HTMLScriptElement): Promise<string> {
        return new Promise((resolve, reject) => {
            if (scriptElement.src === '') {
                resolve(scriptElement.innerText);
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", scriptElement.src)
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        } else {
                            reject(`${xhr.status} ${xhr.statusText}`);
                        }
                    }
                };
                xhr.send();
            }
        });
    }

    private getScriptElements(type: string, id?: string): HTMLScriptElement[] {
        const scriptElements: HTMLScriptElement[] = [];
        for (let i = 0; i < this.scriptElements.length; i++) {
            const el = this.scriptElements[i];
            if (el instanceof HTMLScriptElement) {
                if ((el.type === type) && ((id === undefined) || (el.id === id))) {
                    scriptElements.push(el);
                }
            }
        }
        return scriptElements;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "leaflet-map": LeafletMapElement;
    }
}
