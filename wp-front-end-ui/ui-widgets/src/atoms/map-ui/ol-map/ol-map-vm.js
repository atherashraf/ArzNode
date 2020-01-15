import * as React from "react";

// let Cesium = require('cesium/Cesium');
// // let Cesium = React.lazy(() => {
// //     import(/* webpackChunkName: "Cesium" */
// //         `cesium/Cesium`)
// //     window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
// //     // console.log(window.Cesium);
// // });
// window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
import OLCesium from 'ol-cesium';
// let OLCesium = React.lazy(() => import(/*webpackChunkName: "OLCesium"*/ `ol-cesium`))

require('cesium/Widgets/widgets.css');

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {getCenter, buffer} from 'ol/extent';

import OSM from 'ol/source/OSM';
import Bing from 'ol/source/BingMaps';
import Stamen from 'ol/source/Stamen';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import WKT from "ol/format/WKT";
import {Group} from "ol/layer";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import * as geobuf from "geobuf";
import * as Pbf from "pbf";
import 'ol/ol.css'
import 'ol-ext/control/LayerSwitcher.css'
import {defaults as defaultControls} from 'ol/control';
import MeasureTool from "./interactions/measure-tool";
import './styles/ol-map-vm.css'
import olStyles from './styles/ol-styles';
import ToolbarControl from "./controls/toolbar-control";
import RotateNorthControl from "./controls/rotate-north-control";
import DrawingTool from "./interactions/drawing-tool";
import SelectTool from "./interactions/select-tool";
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser";
import {Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon} from 'ol/geom';
import ImageWMS from 'ol/source/ImageWMS';
import TileWMS from 'ol/source/TileWMS';
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";


class OLMapVM {
    //<editor-fold desc="Initialization Section">
    /**
     * Object of custom interaction
     * @type Object
     * @private
     */
    _customInteractions = {
        "MeasuringTool": new MeasureTool(this),
        "DrawingTool": new DrawingTool(this),
        "SelectTool": new SelectTool(this)
    };
    /**
     * @type OLCesium
     */
    _ol3d
    /**
     * Enable or Disable state of 3D Globe
     * @type {boolean}
     */
    enable3D = false
    /**
     *
     * @type {redux store}
     */
    reduxStore = null

    constructor(extent, zoomLevel, mapProj = 'EPSG:3857') {
        // autoBind(this);
        this._initExtent = extent;
        this._mapProjection = mapProj;
        this._zoomLevel = zoomLevel;
        this._map = null;
        this._view = null;
        this._baseLayers = {};
        this._overlayLayers = {};
        // this._mapExtent =  [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892]
        // this._customInteractions["MeasureTool"] = new MeasureTool(this);

        // this._measureTool = new MeasureTool(this); this.activityIdentifier = this.activityIdentifier.bind(this);
    }

    initMapPanel(targetId, layerSwitcherTargetID) {
        this.setMap(targetId);
        this.addBaseLayers();

        // this._customInteractions["MeasureTool"].initTool();
        this.addLayerSwitcher(layerSwitcherTargetID);
        // this.addCustomController([new RotateNorthControl()])
        for (let key in this._customInteractions) {
            this._customInteractions[key].initTool()
        }
        this.setOLCesium();
    }


    //</editor-fold>

    //<editor-fold desc ="getter setter section">
    setReduxStore(store) {
        this.reduxStore = store;
    }

    getReduxStore() {
        return this.reduxStore;
    }

    setMap(targetId) {
        let me = this;
        this.setView()
        this._map = new Map({
            target: targetId,
            view: this._view,
            controls: defaultControls().extend([
                new ToolbarControl({olMapVM: me}),
                new RotateNorthControl({olMapVM: me})
            ]),
        });
        this._view.fit(this._initExtent, this._map.getSize())
        // this.detect_zoomlevel(this.getMap());
        // let zoomslider = new ZoomSlider();
        // this._map.addControl(zoomslider);
    }

    getMap() {
        return this._map;
    }

    setOLCesium(enable = false) {
        let me = this;
        import(/* webpackChunkName: "Cesium" */ 'cesium/Cesium').then(module => {
            const Cesium = module;
            window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
            me._ol3d = new OLCesium({map: me._map});
            var worldTerrain = Cesium.createWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
            });
            me._ol3d.getCesiumScene().globe.terrainProvider = worldTerrain
            // me._ol3d.getCesiumScene().scene3DOnly = true;
            // me._ol3d.getCesiumScene().terrainExaggeration = 1.5;
            me.enable3D = enable;
            me._ol3d.setEnabled(me.enable3D);
        });
    }

    toogleOLCesium() {
        this.enable3D = !this.enable3D;
        this._ol3d.setEnabled(this.enable3D);
    }

    getOLCesium() {
        return this._ol3d
    }

    getMapProjection() {
        return this._mapProjection;
    }

    setView() {
        // let center1 = fromLonLat([0, 0]);
        let center = getCenter(this._initExtent);

        this._view = new View({
            projection: this.getMapProjection(),
            center: center,
            zoom: this._zoomLevel,
            extent: this._initExtent,
            // rotation: 1
        });

    }

    getView() {
        return this._view;
    }

    getInitExtent() {
        this._initExtent;
    }

    getMapProjectionSRID() {
        this._mapProjection;
    }

    getCustomInteraction(key) {
        return this._customInteractions[key];
    }

    getGroupLayerByName(title) {
        var groupLayer = null;
        //loop each layer of the map
        this._map.getLayers().forEach(function (layer) {
            if (layer instanceof Group) {
                // look if the group layer already exists
                if (layer.get("name") === title) {
                    // check if layer.getLayers exists
                    // if (layer.getLayers) {
                    //     // get inner layers from group layer as Collection
                    //     innerLayers = layer.getLayers(); // no array!
                    //     // new layer to Collection
                    //     innerLayers.push(loadedRoute);
                    //     if (innerLayers instanceof ol.Collection) {
                    //         // set the layer collection of the grouplayer
                    //         layer.setLayers(innerLayers);
                    //     }
                    // }
                    groupLayer = layer
                    return groupLayer;
                }
            }
        });
        return groupLayer;
    }

    getLayerByName(reqLayerName) {
        let requiredLayer = null;
        let layers = this.getMap().getLayers();
        layers.forEach(function (layer, index) {
            if (layer instanceof Group) {
                if (layer.getLayers) {
                    layer.getLayers().getArray().forEach(function (gLayer, index) {
                        let layerName = gLayer.get('name');
                        if (layerName && layerName === reqLayerName) {
                            requiredLayer = gLayer;
                            return;
                        }
                    });
                }
            } else {
                let layerName = layer.get('name');
                if (layerName && layerName === reqLayerName) {
                    requiredLayer = layer;
                    return;
                }
            }

        });
        return requiredLayer;
    }

    getVectorLayerFeatures(reqLayerName) {
        let layer = this.getLayerByName(reqLayerName);
        if (layer instanceof VectorLayer) {
            return layer.get('source').getFeatures();
        }
    }

    getFeatureByPk(layerName, id) {
        let features = this.getVectorLayerFeatures(layerName);
        for (let index in features) {
            if (features[index].getProperties()["pk"].toString() === id.toString())
                return features[index];
        }

    }

    getCustomInteractionTool(key) {
        return this._customInteractions[key]
    }


    //</editor-fold>

    //<editor-fold desc="Layers section">
    addBaseLayers() {
        let bingImgSet = ['AL', 'RD', 'A', 'CD', 'OS'];
        let baseLayers = [this.getStamenLayer(),
            this.getOSMLayer()];
        for (let i in bingImgSet) {
            let visible = (bingImgSet[i] == 'AL' ? true : false)
            baseLayers.push(this.getBingLayer(bingImgSet[i], visible))
        }
        let olBaseLayer = new Group({
            title: 'Base-Layers',
            name: 'base',
            openInLayerSwitcher: false,
            layers: baseLayers
        });
        this.getMap().addLayer(olBaseLayer, 'base', true)
    }

    addLayer(layer, category = 'Others', isBaseLayer = false) {
        if (isBaseLayer) {
            this._map.addLayer(layer)
        } else {
            let groupLayer = this.getGroupLayerByName(category)
            if (groupLayer) {
                let arr = groupLayer.getLayers().getArray();
                arr.push(layer);
            } else {
                groupLayer = new Group({
                    title: category,
                    name: category,
                    openInLayerSwitcher: false,
                    layers: [layer]
                });
                this.getMap().addLayer(groupLayer)
            }
        }
    }

    getBingLayer(imagerySetKey = 'AL', visible = false) {

        let imagerySet = {
            'RD': {name: 'Bing-Road', type: 'RoadOnDemand'},
            'A': {name: 'Bing-Aerial', type: 'Aerial'},
            'AL': {name: 'Bing-Aerial with labels', type: 'AerialWithLabelsOnDemand'},
            'CD': {name: 'Bing-Dark Canavs', type: 'CanvasDark'},
            'OS': {name: 'Bing-Ordnance Survey', type: 'OrdnanceSurvey'}
        };
        let bingLayer = new TileLayer({
            // preload: Infinity,
            title: imagerySet[imagerySetKey].name,
            baseLayer: true,
            visible: visible,
            source: new Bing({
                key: 'AlLccSQ-txfa4gfzC0XxrNaFanQ_jpD0toWcG-VnLEEwF5M3_mCmg_TVrPADz_pe',
                imagerySet: imagerySet[imagerySetKey].type,
            })
        });
        return bingLayer;
    }

    getStamenLayer(visible = false) {
        let stamenLayer = new TileLayer({
            title: "Toner",
            baseLayer: true,
            visible: visible,
            source: new Stamen({layer: 'toner'})
        })
        return stamenLayer;
    }

    getOSMLayer(visible = false) {
        let osm = new TileLayer({
            title: "OSM",
            preload: 4,
            baseLayer: true,
            visible: visible,
            source: new OSM()
        });
        return osm;
    }

    addGeoJSONLayer(url, name, layerName, category = 'Unknown') {
        // let url = path.join(uri,wfsURL);
        // let url ="http://localhost:8123"+ wfsURL;
        (async () => {
            let response = await fetch(url);
            // let data = await response.json();
            let data = await response.arrayBuffer();
            let geojson = geobuf.decode(new Pbf(data));
            this.createGeoJSONLayer(geojson, name, layerName, category);
        })();
    }

    createGeoJSONLayer(geojsonObject, title, layerName, category) {
        let features;
        if (geojsonObject.hasOwnProperty('crs')) {
            features = (new GeoJSON()).readFeatures(geojsonObject, {
                dataProjection: geojsonObject.crs.properties.name,
                featureProjection: this.getMapProjection()
            });
        } else {
            features = (new GeoJSON()).readFeatures(geojsonObject)
        }
        let vectorSource = new VectorSource({
            features: features,
            format: new GeoJSON
        });
        let styleFunction = function (feature) {
            return olStyles(feature.getGeometry().getType());
        };
        let vectorLayer = new VectorLayer({
            // imageRatio: 2,
            name: layerName,
            title: title,
            source: vectorSource,
            style: styleFunction
        });
        this.addLayer(vectorLayer, category)
    }

    addWMSLayer(url, title, layerName, category) {
        let ImageLayer = new ImageLayer({
            title: title,
            // extent: [-13884991, 2870341, -7455066, 6338219],
            source: new ImageWMS({
                url: url,
                params: {'LAYERS': layerName},
                ratio: 1,
                serverType: 'geoserver'
            })
        })
    }

    addWMSTileLayer(url, title, layerName, category) {
        // let url = uri + "";
        let tileLayer = new TileLayer({
            title: title,
            // extent: [-13884991, 2870341, -7455066, 6338219],
            source: new TileWMS({
                url: url,
                params: {'LAYERS': layerName, 'TILED': true},
                // Countries have transparency, so do not fade tiles:
                transition: 0
            })
        });
        this.addLayer(tileLayer, category);
    }

    //</editor-fold>

    //<editor-fold desc="Controllers section">
    addLayerSwitcher(layerSwitcherTargetID) {
        let target = null;
        if (layerSwitcherTargetID) {
            target = document.getElementById(layerSwitcherTargetID);
        }
        let ctrl = new LayerSwitcher({
            target: target,
            // displayInLayerSwitcher: function (l) { return false; },
            show_progress: true,
            extent: true,
            trash: true,
            oninfo: function (l) {
                // alert(l.get("title"));
            }
        });
        this.getMap().addControl(ctrl);
    }

    /**
     * add custom controller on ol-map like new RotateNorthControl()
     * @param controller
     *
     */
    addCustomController(controls) {
        let customControl = defaultControls().extend(controls)
        this.getMap().addControl(customControl);
    }

    //</editor-fold>

    //<editor-fold desc="Interactions section">
    addInteraction(key, drawingType = 1) {
        for (let k in this._customInteractions) {
            this._customInteractions[k].removeInteractionFromMap();
        }
        this._customInteractions[key].addInteractionOnMap(drawingType);
    }

    //</editor-fold>

    //<editor-fold overlays section>
    createOverlayToolbar() {

    }

    addOverlay(overlay) {
        this.getMap().addOverlay(overlay);
    }

    //</editor-fold>

    //<editor-fold desc="utilities">
    olGeom2Text(olGeom) {
        var format = new WKT();
        return format.writeGeometry(olGeom);
    }

    // convert2JSTSGeometry(geometry) {
    //     let parser = new OL3Parser();
    //     parser.inject(Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon);
    //     return parser.read(geometry);
    // }


    zoomToGeometry(geometry) {
        let parser = new OL3Parser();
        parser.inject(Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon);
        if (geometry.getType() == "Point") {
            let jstsGeom = parser.read(geometry);
            let buffered = jstsGeom.buffer(1000)
            let buffGeom = parser.write(buffered)
            this.zoomToExtent(buffGeom.getExtent())
        } else {
            this.zoomToExtent(geometry.getExtent())
        }

    }

    zoomToExtent(extent) {
        this.getView().fit(extent, this.getMap().getSize());

    }

    updateMap() {
        if (this.getMap()) {
            this.getMap().updateSize();
        }
    }

    //</editor-fold>
}

export default OLMapVM;