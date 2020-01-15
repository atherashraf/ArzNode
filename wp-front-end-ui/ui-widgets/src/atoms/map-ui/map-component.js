import * as React from "react";
import MapOutput from "./map-output"
import {Provider, connect} from "react-redux";


class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.divMapCmpRef = React.createRef();
        this.state = {
            divMapCmpHeight: "100%"
        }
        this.props.olMapVM.setReduxStore(this.props.store);
    }


    componentDidMount() {
        const pNode = this.divMapCmpRef.current;
        this.props.olMapVM.initMapPanel('div-map-cmp');
        for (let i = 0; i < this.props.initLayers.length; i++) {
            let initLayer = this.props.initLayers[i];
            let url  = this.props.uri + this.props.wfsURL + initLayer.layerName;
            this.props.olMapVM.addGeoJSONLayer(url, initLayer.name, initLayer.layerName, initLayer.category);
            // let url  = this.props.uri + this.props.wmsURL + initLayer.layerName;
            // this.props.olMapVM.addWMSLayer(url, initLayer.name, initLayer.layerName, initLayer.category);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.olMapVM.updateMap();
    }

    // handelWindowResize(){
    //     this.props.olMapVM.updateMap();
    // }
    render() {
        // window.addEventListener('resize', this.handelWindowResize)
        let mapDivStyle = {
            width: '100%',
            height: this.state.divMapCmpHeight,
        }
        return (
            <div id="div-map-cmp" ref={this.divMapCmpRef} style={mapDivStyle}>
                <Provider store={this.props.store}><MapOutput/></Provider>
            </div>

        )
    }
}


// export default MapComponent;
const mapStateToProps = (state) => {
    return state;
}
// const mapDispatchToProps = (dispatch) => {
//     return {
//         // handleEnable3D: (evt) => {
//         //     // console.log("handle input change...");
//         //     dispatch({type: 'TOGGLE_3D_CHANGE'})
//         // }
//     }
// }
export default connect(mapStateToProps)(MapComponent);
