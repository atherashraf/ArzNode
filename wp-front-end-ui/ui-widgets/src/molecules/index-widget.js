import * as React from "react";
import * as ReactDOM from "react-dom";
import Provider from "react-redux/lib/components/Provider";
import AppStoreModel from "../store/app-store-model";
import IndexPage from "../atoms/index-page";

let appStore = new AppStoreModel();
appStore.add2InitState(config);


ReactDOM.render(<Provider store={appStore.getStore()}> <IndexPage/></Provider>, document.getElementById('div-main-contents'));