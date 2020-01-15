import Overlay from "ol/Overlay";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import {getArea, getLength} from 'ol/sphere';
import DrawTool from "./draw-tool";


class MeasureTool {
    _drawTool;
    _olMapVM;
    _measureOverlays = [];
    /**
     * The measure tooltip element.
     * @type {HTMLElement}
     */
    measureTooltipElement;

    /**
     * Overlay to show the measurement.
     * @type {Overlay}
     */
    measureTooltip;

    constructor(olMapVM) {
        this._olMapVM = olMapVM;
        // this.addInteractionOnMap = this.addInteractionOnMap.bind(this);
    }

    initTool(drawType = 1) {
        this._drawTool = new DrawTool(this._olMapVM)
        let layer = this._drawTool.initDrawLayer('measure layer', true);
        this._olMapVM.addLayer(layer);
        this._drawTool.initDrawTool(drawType);
        this.createMeasureTooltip();
    }

    addInteractionOnMap(drawingType) {

        this._drawTool.changeDrawType(drawingType);
        let me = this;
        // this._drawTool.getDrawSource().clear();
        this._drawTool.createHelpTooltip();
        this._olMapVM.getMap().addInteraction(this._drawTool.getDraw());

        this._drawTool.addDrawStartListener(function (evt) {
            // console.log('draw started');
            let geom = evt.target;
            let output;
            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            let tooltipCoord = evt.coordinate;
            if (geom instanceof Polygon) {
                output = me.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
                output = me.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            if (me._measureOverlays.length === 0)
                me.createMeasureTooltip();
            me.measureTooltipElement.innerHTML = output;
            me.measureTooltip.setPosition(tooltipCoord);
        });
        this._drawTool.addDrawEndListener(function (feature) {
            // let geom = feature.getGeometry();
            // console.log('draw ended...' + me._olMapVM.olGeom2Text(geom));
            me.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            me.measureTooltip.setOffset([0, -7]);

            // unset tooltip so that a new one can be created
            me.measureTooltipElement = null;
            me.createMeasureTooltip();

        });
    }

    removeInteractionFromMap() {
        this._drawTool.getDrawSource().clear();
        this._drawTool.removeAllOverlays();
        this._olMapVM.getMap().removeInteraction(this._drawTool.getDraw());
        let me = this;
        this._measureOverlays.forEach(function (overlay) {
            me._olMapVM.getMap().removeOverlay(overlay);
        });
        this._measureOverlays = [];
    }

    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip() {
        // if (this.measureTooltipElement) {
        //     this.measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        // }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        let measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        this._measureOverlays.push(measureTooltip);
        this._olMapVM.getMap().addOverlay(measureTooltip);
        this.measureTooltip = measureTooltip;
    }


    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
     */
    formatLength(line) {
        let length = getLength(line);
        let output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    }


    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    formatArea(polygon) {
        let area = getArea(polygon);
        let output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    }


}

export default MeasureTool;
