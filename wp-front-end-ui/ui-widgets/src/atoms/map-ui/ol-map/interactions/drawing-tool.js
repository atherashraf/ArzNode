import DrawTool from "./draw-tool";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";

class DrawingTool {
    _drawTool;
    _olMapVM;
    _drawingType;

    /**
     * instansiation of DrawingTool
     * @param olMapVM
     */
    constructor(olMapVM) {
        this._olMapVM = olMapVM;
        // this.addInteractionOnMap = this.addInteractionOnMap.bind(this);
    }

    /**
     * initialization of tool
     */
    initTool(initDrawType=1) {
        this._drawTool = new DrawTool(this._olMapVM);
        let layer = this._drawTool.initDrawLayer('drawing layer', true);
        this._olMapVM.addLayer(layer);
        this._drawTool.initDrawTool(initDrawType);
    }




    /**
     * for drawing on maping using draw tool
     */
    addInteractionOnMap(drawingType) {
        // if(this._drawTool.getDrawSource()){
        //     this._drawTool.getDrawSource().clear();
        //     this._olMapVM.getMap().removeInteraction(this._drawTool.getDraw());
        // }
        this._drawingType = drawingType;
        this._drawTool.changeDrawType(drawingType);
        let me = this;
        this._olMapVM.getMap().addInteraction(this._drawTool.getDraw());
        this._drawTool.createHelpTooltip();
        this._drawTool.addDrawStartListener(function (evt) {
            // console.log('draw started');
            let geom = evt.target;
            let output;
            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            let tooltipCoord = evt.coordinate;

        });
        this._drawTool.addDrawEndListener(function (feature) {
            let geom = feature.getGeometry();
            console.log('draw ended...');


        });
    }

    /**
     * to removing interaction so user can use other interaction
     */
    removeInteractionFromMap() {
        this._drawTool.getDrawSource().clear();
        this._drawTool.removeAllOverlays();
        this._olMapVM.getMap().removeInteraction(this._drawTool.getDraw());

    }
}

export default DrawingTool
