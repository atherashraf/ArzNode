import * as ReactDOM from 'react-dom';
import * as React from 'react';
import AppStoreModel from "../store/app-store-model";
import Provider from "react-redux/lib/components/Provider";
import SignInFormPage from "../atoms/base-ui/signin-page";

let appStore = new AppStoreModel()
appStore.add2InitState(config)

ReactDOM.render(<Provider store={appStore.getStore()}> <SignInFormPage/></Provider>, document.getElementById('div-login-form'));
