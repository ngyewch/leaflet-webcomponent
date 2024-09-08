[![npm](https://img.shields.io/npm/v/@ngyewch/leaflet-webcomponent)](https://www.npmjs.com/package/@ngyewch/leaflet-webcomponent)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ngyewch/leaflet-webcomponent/CI.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/ngyewch/leaflet-webcomponent)

# leaflet-webcomponent

Simple web component for displaying [Leaflet](https://leafletjs.com/) maps.

## Usage

### Import

Script tag:
```
<script type="module" src="https://cdn.jsdelivr.net/npm/@ngyewch/leaflet-webcomponent@0.2.0/dist/leaflet-webcomponent.es.js"></script>
```

Alternative:
```
<script defer src="https://cdn.jsdelivr.net/npm/@ngyewch/leaflet-webcomponent@0.2.0/dist/leaflet-webcomponent.umd.js"></script>
```

### Markup

```
    <leaflet-map id="test1">
        <script type="application/json">
            {
                "options": {
                    "center": [
                        1.3521,
                        103.8198
                    ],
                    "zoom": 3
                },
                "scaleOptions": {
                    "maxWidth": 200
                },
                "baseLayers": [
                    {
                        "name": "OpenStreetMaps",
                        "config": {
                            "kind": "TileLayer",
                            "urlTemplate": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "options": {
                                "attribution": "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
                            }
                        }
                    }
                ],
                "overlayLayers": [
                    {
                        "name": "OpenSeaMap",
                        "selected": false,
                        "config": {
                            "kind": "TileLayer",
                            "urlTemplate": "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
                            "options": {
                                "opacity": 0.2,
                                "attribution": "Map data: &copy; <a href=\"http://www.openseamap.org\">OpenSeaMap</a> contributors"
                            }
                        }
                    }, {
                        "name": "Singapore Neighbourhoods",
                        "selected": false,
                        "config": {
                            "kind": "GeoJSON",
                            "id": "singapore-neighbourhoods",
                            "fitBounds": true,
                            "options": {
                                "attribution": "Map data: &copy; <a href=\"https://insideairbnb.com/get-the-data/\">Inside Airbnb</a> contributors"
                            }
                        }
                    }
                ]
            }
        </script>
        <script id="singapore-neighbourhoods" type="application/geo+json" src="testdata/neighbourhoods.geojson"></script>
    </leaflet-map>
```