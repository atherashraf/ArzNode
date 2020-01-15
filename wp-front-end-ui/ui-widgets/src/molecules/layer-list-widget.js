import * as ReactDOM from 'react-dom';
import * as React from 'react';
import AppStoreModel from "../store/app-store-model";
import LayerListView from "../atoms/layer-ui/layer-list-view";
import Provider from "react-redux/lib/components/Provider";


let appStore = new AppStoreModel()
appStore.add2InitState(config);
let store = appStore.getStore();
ReactDOM.render(<Provider store={store}><LayerListView/></Provider>,
    document.getElementById('div-main-contents'));