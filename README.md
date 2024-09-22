[![npm](https://img.shields.io/npm/v/@ngyewch/leaflet-webcomponent)](https://www.npmjs.com/package/@ngyewch/leaflet-webcomponent)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ngyewch/leaflet-webcomponent/CI.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/ngyewch/leaflet-webcomponent)

# leaflet-webcomponent

Simple web component for displaying [Leaflet](https://leafletjs.com/) maps.

## Usage

### Import

Script tag:
```
<script type="module" src="https://cdn.jsdelivr.net/npm/@ngyewch/leaflet-webcomponent@0.6.0/dist/leaflet-webcomponent.js"></script>
```

### Markup

```
    <leaflet-map>
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
                                "attribution": "&copy; <a href=\"http://www.openseamap.org\">OpenSeaMap</a> contributors"
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
                                "attribution": "&copy; <a href=\"https://insideairbnb.com/get-the-data/\">Inside Airbnb</a> contributors"
                            }
                        }
                    }, {
                        "name": "Newark, N.J. in 1922",
                        "selected": false,
                        "config": {
                            "kind": "ImageOverlay",
                            "imageUrl": "https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg",
                            "bounds": [[40.799311, -74.118464], [40.68202047785919, -74.33]],
                            "fitBounds": true,
                            "options": {
                                "attribution": "Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.",
                                "opacity": 0.8,
                                "errorOverlayUrl": "https://cdn-icons-png.flaticon.com/512/110/110686.png",
                                "interactive": true
                            }
                        }
                    }, {
                        "name": "Hurricane Patricia",
                        "selected": false,
                        "config": {
                            "kind": "VideoOverlay",
                            "videoUrl": [
                                "https://www.mapbox.com/bites/00188/patricia_nasa.webm",
                                "https://www.mapbox.com/bites/00188/patricia_nasa.mp4"
                            ],
                            "bounds": [[32, -130], [13, -100]],
                            "fitBounds": true,
                            "options": {
                                "attribution": "NASA GSFC GOES Project",
                                "opacity": 0.8,
                                "errorOverlayUrl": "https://cdn-icons-png.flaticon.com/512/110/110686.png",
                                "interactive": true,
                                "autoplay": true,
                                "muted": true,
                                "playsInline": true
                            }
                        }
                    }
                ]
            }
        </script>
        <script id="singapore-neighbourhoods" type="application/geo+json" src="testdata/neighbourhoods.geojson"></script>
    </leaflet-map>
```
