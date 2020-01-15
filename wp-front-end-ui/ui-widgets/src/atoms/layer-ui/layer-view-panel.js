import * as React from "react";
import {withStyles, Container} from '@material-ui/core';
import {styles} from "../../molecules/static/styles/materialui-styles";
import PropTypes from "prop-types";
import autoBind from "auto-bind";


class LayerViewPanel extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.divLayerRef = React.createRef();
    }

    componentDidMount() {
        this.handleResize();
    }


    handleResize() {
        const pNode = this.divLayerRef.current;
        let mapContainer = document.getElementById("map-container");
        mapContainer.style.height = pNode.clientHeight + "px";
        mapContainer.style.visibility = "visible";
        pNode.appendChild(mapContainer)
    }

    render() {
        window.addEventListener('resize', this.handleResize)
        const {classes} = this.props;
        const refElem = this.divLayerRef
        return (
            <React.Fragment>
                <Container className={classes.container} ref={refElem} maxWidth="md" style={{padding: "0px"}}>

                </Container>
            </React.Fragment>
        );
    }
}

LayerViewPanel.propTypes = {
    classes: PropTypes.object.isRequired,
    // divLayerRef: PropTypes.oneOfType([
    //     // Either a function
    //     PropTypes.func,
    //     // Or the instance of a DOM native element (see the note about SSR)
    //     PropTypes.shape({current: PropTypes.instanceOf(Element)})
    // ]).isRequired,
    // render: PropTypes.func.isRequired
};
export default (withStyles(styles)(LayerViewPanel));