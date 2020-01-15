import {Control} from "ol/control";
import MapToolbarItems from "../../map-toolbar-items";
import * as ReactDOM from 'react-dom';
import * as React from "react";
import {Provider} from "react-redux";
// import layersIcon from 'assets/images/maps/my-marker.png';
let ToolbarControl = /*@__PURE__*/(function (Control) {
    let options = {}

    function ToolbarControl(opt_options) {
        options = opt_options || {};
        let element = document.createElement('nav');
        element.className = 'toolbar-control ol-unselectable ol-control';
        // element.appendChild(ul);
        let store = options.olMapVM.getReduxStore();
        // console.log(store);
        ReactDOM.render(<Provider store={store}><MapToolbarItems olMapVM={options.olMapVM}
                                                                 store={store}/></Provider>, element)
        Control.call(this, {
            element: element,
            target: options.target
        });
        // button.addEventListener('click', this.handleRotateNorth.bind(this), false);
    }

    if (Control) ToolbarControl.__proto__ = Control;
    ToolbarControl.prototype = Object.create(Control && Control.prototype);
    ToolbarControl.prototype.constructor = ToolbarControl;

    ToolbarControl.prototype.handleRotateNorth = function handleRotateNorth() {
        options.olMapVM.getMap().getView().setRotation(0);
    };

    return ToolbarControl;
}(Control));

export default ToolbarControl;
