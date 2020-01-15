import {Provider} from "react-redux";
import * as React from "react";
import * as ReactDOM from "react-dom";
import MapComponent from "../atoms/map-ui/map-component";
import MapUiStoreModel from "../store/map-ui-store-model";

let mapUIStoreModel = new MapUiStoreModel();
// let mapConfig = {};
// mapConfig.olMapVM = this.props.olMapVM;
// console.log(config)
let mapConfig = mapUIStoreModel.getMapStoreConfig(config)
mapUIStoreModel.add2InitState(mapConfig);
let mapStore = mapUIStoreModel.getStore();
config.olMapVM = mapUIStoreModel.getOLMapVM();
let cmp = <Provider store={mapStore}>
    {/*<MapComponent initLayer={initLayer} storeData={config} olMapVM={this.props.olMapVM}/>*/}
    <MapComponent store={mapStore}/>
</Provider>

ReactDOM.render(cmp, document.getElementById("map-container"))