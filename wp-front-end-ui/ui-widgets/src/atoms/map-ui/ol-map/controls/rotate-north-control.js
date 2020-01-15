import {Control} from 'ol/control';

let RotateNorthControl = /*@__PURE__*/(function (Control) {
    let options = {}

    function RotateNorthControl(opt_options) {
        options = opt_options || {};

        let button = document.createElement('button');
        button.innerHTML = 'N';

        let element = document.createElement('div');
        element.className = 'rotate-north ol-unselectable ol-control';
        element.appendChild(button);

        Control.call(this, {
            element: element,
            target: options.target
        });

        button.addEventListener('click', this.handleRotateNorth.bind(this), false);
    }

    if (Control) RotateNorthControl.__proto__ = Control;
    RotateNorthControl.prototype = Object.create(Control && Control.prototype);
    RotateNorthControl.prototype.constructor = RotateNorthControl;

    RotateNorthControl.prototype.handleRotateNorth = function handleRotateNorth() {
        options.olMapVM.getMap().getView().setRotation(0);
    };

    return RotateNorthControl;
}(Control));

export default RotateNorthControl;