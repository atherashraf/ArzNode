import * as ReactDOM from 'react-dom';
import * as React from 'react';
import AppStoreModel from "../store/app-store-model";
import {Provider} from "react-redux";
import TopAppBar from "../atoms/base-ui/top-appbar";
import BottomAppBar from "../atoms/base-ui/bottom-appbar";
import SideDrawer from "../atoms/base-ui/side-drawer";

function baseApp() {
    let appStore = new AppStoreModel();
    appStore.add2InitState(config);
    let store = appStore.getStore()

    ReactDOM.render(<Provider store={store}><TopAppBar/></Provider>,
        document.getElementById('nav-topbar'))
    ReactDOM.render(<Provider store={store}><BottomAppBar/></Provider>,
        document.getElementById('nav-bottombar'))
    ReactDOM.render(<Provider store={store}><SideDrawer/></Provider>,
        document.getElementById('div-side-drawer'))
    // ReactDOM.render(<MessageSnackbar snackbarMessage={"its working..."}/>,
    //     document.getElementById('div-message'))
}

baseApp();
