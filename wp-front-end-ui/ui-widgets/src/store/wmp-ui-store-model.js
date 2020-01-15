import AppStoreModel from "./app-store-model";
import {createStore} from "redux";



class WMPUiStoreModel extends AppStoreModel {
    constructor() {
        super();
        this.initState = {
            ...super.initState,
            mainLayerName: 'test',
            initLayers: [],
            wfsURL: null,
            jqxWMPDataURL: null,
            jqxGridDataURL:null,
            fullScreen:{
                "grid": false,
                "map" : false,
            },
        }
        this.store = null;
    }

    getStore() {
        if (!this.store)
            this.store = createStore(this.reducer);
        return this.store;
    }

    reducer(state = this.initState, action) {
        super.reducer(state, action)
        let fullScreen = Object.create(state.fullScreen);
        switch (action.type) {
            case "TOGGLE_FULL_SCREEN":
                fullScreen[action.key] = !fullScreen[action.key];
                return Object.assign({}, state, {fullScreen:fullScreen});
            case "FULL_SCREEN_MODE":
                fullScreen[action.key] = true;
                let obj =  Object.assign({}, state, {fullScreen:fullScreen})
                return obj;
            case "FULL_SCREEN_STATE":
                fullScreen[action.key] = action.state;
                return Object.assign({}, state, {fullScreen:fullScreen});
            default:
                return state; //super.reducer(state, action);
        }
    }
}

export default WMPUiStoreModel;