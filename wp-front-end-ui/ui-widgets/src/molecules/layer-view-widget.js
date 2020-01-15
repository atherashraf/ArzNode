import * as React from 'react';
import * as ReactDOM from 'react-dom';
import LayerViewPanel from "../atoms/layer-ui/layer-view-panel"
let mountElement = document.getElementById('div-main-contents');
const layerViewPanel = <LayerViewPanel />;
ReactDOM.render(layerViewPanel, mountElement);


