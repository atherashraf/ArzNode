import * as React from "react";
import {connect} from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import {withStyles} from "@material-ui/core";
import {styles} from "../../molecules/static/styles/materialui-styles";
import autoBind from "auto-bind";

class MapOutput extends React.PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);
        this.outputDivRef = React.createRef();
    }

    render() {
        const {classes} = this.props;
        const bottomDrawerDiv = {
            width: '100%',
            // height: '100%',
            backgroundColor: this.props.appDefaultColor
        }

        return (
            <Drawer anchor="bottom" classes={{paperAnchorBottom: classes.paperAnchorBottom}}
                    open={this.props.openDrawer.outputDrawer}
                    variant="persistent"
                    onClose={this.props.handleCloseDrawer}>
                <div id={"output-div"} style={bottomDrawerDiv} role="presentation"></div>
            </Drawer>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        handleCloseDrawer() {
            dispatch({type: 'CLOSE_DRAWER', drawerKey: 'outputDrawer'})
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapOutput));