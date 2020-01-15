import OLMapVM from "../atoms/map-ui/ol-map/ol-map-vm";
import AppStoreModel from "./app-store-model";
import {createStore} from "redux";


class MapUiStoreModel extends AppStoreModel {
    constructor() {
        super();
        // this.initState["olMapVM"] = ;
        this.initState = {
            ...super.initState,
            appDefaultColor: null,
            olMapVM: new OLMapVM(this.initExtent, this.mapZoomLevel),
            uri: null,
            wfsURL: null,
            mainLayerName: 'test',
            jqxGridDataURL: null,
            initLayers: null,
            attributeTable: {
                fields: [],
                columns: [],
                data: []
            },
            openDrawer: {
                // layerActionsDrawer: false,
                outputDrawer: false,
                show: false,
            },
            mapOutputType: null,
        }
        this.store = null;
    }

    getOLMapVM() {
        return this.initState.olMapVM;
    }

    getMapStoreConfig(config) {
        let mapConfig = {}
        // mapConfig.uri = config.uri;
        // mapConfig.wfsURL = config.wfsURL;
        // mapConfig.jqxGridDataURL = config.jqxGridDataURL
        // mapConfig.mainLayerName = config.mainLayerName;
        // mapConfig.initLayers = config.initLayers;
        for (let key in this.initState) {
            if (key in config) {
                if (key != "olMapVM") {
                    mapConfig[key] = config[key]
                }
            }
        }

        return mapConfig
    }

    getStore() {
        if (!this.store)
            this.store = createStore(this.reducer);
        return this.store;
    }

    reducer(state = this.initState, action) {
        let openDrawer = Object.create(state.openDrawer);
        let res = null;
        switch (action.type) {
            case 'SET_LAYER_NAME':
                return Object.assign({}, state, {layerName: action.layerName});
            case 'TOGGLE_DRAWER':
                openDrawer[action.drawerKey] = !openDrawer[action.drawerKey];
                return Object.assign({}, state, {openDrawer: openDrawer});
            case 'CLOSE_DRAWER':
                openDrawer[action.drawerKey] = false;
                return Object.assign({}, state, {openDrawer: openDrawer});
            case 'OPEN_DRAWER':
                openDrawer[action.drawerKey] = true;
                res = Object.assign({}, state, {openDrawer: openDrawer});
                return res;
            case 'MAP_OUTPUT_TYPE':
                res = Object.assign({}, state, {mapOutputType: action.mapOutputType})
                return res;
            default:
                return super.reducer(state, action);
        }

    }


}

export default MapUiStoreModel;

