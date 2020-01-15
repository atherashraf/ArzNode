import {createStore} from 'redux';
import autoBind from "auto-bind";
import * as React from "react";
import * as ReactDOM from "react-dom";
import MessageSnackbar from "../atoms/base-ui/message-snackbar";


export default class AppStoreModel {
    initExtent = [7926730.2424, 4097644.4256, 8648557.8475, 4441147.611];
    mapZoomLevel = 6;

    constructor() {
        autoBind(this);
        this.initState = {
            openSidebar: false,
            openSnackbar: false,
            openSignedInForm: false,
            snackbarMessage: "",
            navItems: [],
            userItems: [],
            user: null,
            extent3857: this.initExtent,
        }
        this.store = null;
    }

    getStore() {
        if (!this.store)
            this.store = createStore(this.reducer);
        return this.store;
    }

    // showSnackbar() {
    //     let snakbar = <Snackbar anchorOrigin={{
    //         vertical: 'bottom',
    //         horizontal: 'center',
    //         aca
    //     }} open={this.props.openSnackbar} autoHideDuration={6000}
    //         // onClose={this.props.handleCloseSnackbar}
    //                             ContentProps={{
    //                                 'aria-describedby': 'message-id',
    //                             }}
    //                             message={<span id="message-id">{this.props.snackbarMessage}</span>}
    //                             action={[
    //                                 <IconButton
    //                                     key="close"
    //                                     aria-label="close"
    //                                     color="inherit"
    //                                     className={classes.close}
    //                                     onClick={this.props.handleCloseSnackbar}
    //                                 >
    //                                     <CloseIcon/>
    //                                 </IconButton>,
    //                             ]}
    //     />
    //     ReactDOM.render(snakbar, document.getElementById('div-message'))
    // }

    reducer(state = this.initState, action) {
        let resObj;
        switch (action.type) {
            case 'TOGGLE_SIDEBAR':
                return Object.assign({}, state, {openSidebar: !state.openSidebar});
            case 'SIGNED_IN':
                let data = action.data;
                return Object.assign({}, state, {
                    user: data.user,
                    userItems: data.user_items,
                    navItems: data.nav_items
                });
            case 'SIGNED_OUT':
                return Object.assign({}, state, {user: null, userItems: [], navItems: []});
            case 'CLOSE_SNACKBAR':
                return Object.assign({}, state, {openSnackbar: false, snackbarMessage: ""});
            case 'OPEN_SNACKBAR':
                ReactDOM.render(<MessageSnackbar snackbarMessage={"its working..."}/>,
                    document.getElementById('div-message'))
                break;
            //return Object.assign({}, state, {openSnackbar: true, snackbarMessage: action.message});
            case 'CLOSE_SIGNED_IN_FORM':
                resObj = Object.assign({}, state, {openSignedInForm: false});
                return resObj;
            case 'OPEN_SIGNED_IN_FORM':
                resObj = Object.assign({}, state, {openSignedInForm: true});
                return resObj;
            default:
                return state;
        }
    }

    add2InitState(additionalConfig) {
        if (typeof additionalConfig === 'object') {
            // for (let key in layerConfig) {
            //     this.initState[key] = layerConfig[key];
            // }
            this.initState = {
                ...this.initState,
                ...additionalConfig
            }
        }
    }
}

// let appStore = new AppStore();
// appStore.add2InitState(config);
// export default appStore;
// let appStateReducer = new AppStateReducer();

// export const appStore = createStore(appStateReducer.reducer);

