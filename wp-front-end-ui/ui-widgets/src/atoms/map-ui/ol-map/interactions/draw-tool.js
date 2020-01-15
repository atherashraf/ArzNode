import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Draw, {createBox} from 'ol/interaction/Draw';
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import Overlay from "ol/Overlay";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
// import '../../../../style/maps/ol-tool.css'
import {unByKey} from "ol/Observable";

class DrawTool {
    _draw = null;
    _drawSource = new VectorSource();
    _drawLayer = null;
    _drawTypes = ['Point', 'LineString', 'Polygon','Circle','None','Box']
    _olMapVM = null;
    _drawToolOverlays = [];
    _drawType = null;
    /**
     * The help tooltip element.
     * @type {HTMLElement}
     */
    helpTooltipElement;

    /**
     * Overlay to show the help messages.
     * @type {Overlay}
     */
    helpTooltip;
    /**
     * Currently drawn feature.
     * @type {import("../src/ol/Feature.js").default}
     */
    sketch;

    /**
     * tool interaction listener
     * @type  eventListener
     */
    listener

    /**
     * constructor for draw tool
     * @param olMapVM
     */
    constructor(olMapVM) {
        this._olMapVM = olMapVM;
    }

    //<editor-fold desc="Initialization Section">
    /**
     * Initializing draw layer to view draw feature on map
     * @param title
     * @param displayInLayerSwitcher
     * @param style
     * @returns {*}
     */
    initDrawLayer(title = 'draw layer', displayInLayerSwitcher = false, style = this.getLayerDefaultStyle()) {
        // if (!style) style = this.getLayerDefaultStyle()
        if (!this._drawLayer) {
            this._drawLayer = new VectorLayer({
                title: title,
                visible: true,
                displayInLayerSwitcher: displayInLayerSwitcher,
                source: this.getDrawSource(),
                style: style
            })
            return this._drawLayer;
        }
        return null;
    }

    // Change Draw Type
    /**
     * Change Draw Type
     */
    changeDrawType(drawType){
        // this._draw.set('type', drawType, false)
        this.initDrawTool(drawType);
    }

    /**
     * Initializing draw tool to draw feature on map
     * @param drawTypeIndex -- type of geometry to draw
     * @param style  -- style with which geometry should display
     * @returns {*}
     */
    initDrawTool(drawTypeIndex=1, style = this.getDrawDefaultStyle()) {
        this._drawType = this._drawTypes[drawTypeIndex];
        // if (!this._draw) {

        if(drawTypeIndex === 5){
            this._draw = new Draw({
                source: this.getDrawSource(),
                type: this._drawType,
                geometryFunction: createBox()
            });
        }
        else {
            this._draw = new Draw({
                source: this.getDrawSource(),
                type: this._drawType,
                // type: "Circle",
                style: style
            });
        }


        // }
        this.createHelpTooltip();
        return this._draw;
    }

    /**
     * Creates a new help tooltip
     */
    createHelpTooltip() {
        // let me = this;
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'ol-tooltip hidden';
        this.helpTooltipElement.name = "helpTooltipElem"
        // if(this.helpTooltip){
        //     this._olMapVM.getMap().removeOverlay(this.helpTooltip);
        // }
        let helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        this._drawToolOverlays.push(helpTooltip);
        // this._olMapVM.addOverlay(this.helpTooltip);
        this._olMapVM.getMap().addOverlay(helpTooltip);
        this.helpTooltip = helpTooltip
    }

    removeAllOverlays() {
        // let elems = document.getElementsByName('helpTooltipElem')
        if (this.helpTooltipElement) {
            this.helpTooltipElement.classList.add('hidden');
        }
        // if (this.helpTooltipElement) {
        //     this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        //     // this.helpTooltipElement = null;
        // }
        let me = this;
        this._drawToolOverlays.forEach(function (overlay) {
            me._olMapVM.getMap().removeOverlay(overlay);
        });
        this._drawToolOverlays = [];
    }

    //</editor-fold>

    //<editor-fold desc="getter setter">

    getDrawSource() {
        if (!this._drawSource) {
            this._drawSource = new VectorSource();
        }
        return this._drawSource;
    }

    getDraw() {
        return this._draw;
    }

    //</editor-fold>

    //<editor-fold desc="default settings">
    getLayerDefaultStyle() {
        let style = new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: '#ffcc33'
                })
            })
        });
        return style;
    }

    getDrawDefaultStyle() {
        let style = new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        });
        return style;
    }

    //</editor-fold>

    //<editor-fold desc="Listener and Handlers">
    addDrawStartListener(callback) {
        let me = this;

        this._olMapVM.getMap().on('pointermove', this.pointerMoveHandler.bind(this));
        this._olMapVM.getMap().getViewport().addEventListener('mouseout', function () {
            if (this.helpTooltipElement) {
                this.helpTooltipElement.classList.add('hidden');
            }
        });
        this._draw.on('drawstart', function (evt) {
            // set sketch
            me.sketch = evt.feature;


            me.listener = me.sketch.getGeometry().on('change', function (evt) {
                // let geom = evt.target;
                callback(evt)
            });

        });
    }

    addDrawEndListener(callback) {
        let me = this;
        this._draw.on('drawend', function (evt) {
            // unset sketch
            me.sketch = null;
            unByKey(me.listener);
            callback(evt.feature);
        });
    }


    /**
     * Handle pointer move.
     * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
     */
    pointerMoveHandler(evt, sketch) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        let helpMsg;
        let continuePolygonMsg;
        let continueLineMsg;

        if(this._drawType === 'Box'){
            helpMsg = 'Click shift with click and start drawing';
            continuePolygonMsg = 'Keep pressing Shift and continue drawing';
            continueLineMsg = 'Press shift and Click to continue drawing the Box';
        }
        else{
            helpMsg = 'Click to start drawing';
            continuePolygonMsg = 'Click to continue drawing the polygon';
            continueLineMsg = 'Click to continue drawing the line';
        }

        if (this.sketch) {
            let geom = this.sketch.getGeometry();
            if (geom instanceof Polygon) {
                helpMsg = continuePolygonMsg;
            } else if (geom instanceof LineString) {
                helpMsg = continueLineMsg;
            }
        }
        // if (!this.helpTooltipElement){
        //     this.createHelpTooltip();
        // }
        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);

        this.helpTooltipElement.classList.remove('hidden');
    }

    //</editor-fold>
}

export default DrawTool;
