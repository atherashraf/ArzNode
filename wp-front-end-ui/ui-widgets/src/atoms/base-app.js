import * as React from 'react';
import connect from "react-redux/lib/connect/connect";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {withStyles, withTheme} from "@material-ui/core";
import {styles} from "../molecules/static/styles/materialui-styles";
import PropTypes from "prop-types";
import TopAppbar from "./base-ui/top-appbar";
import BottomAppBar from "./base-ui/bottom-appbar";
import SideDrawer from "./base-ui/side-drawer";

class BaseApp extends React.Component {
    render() {
        const {userInfo} = this.props;
        const {classes} = this.props;
        return (
            <React.Fragment>
                <nav id="nav-topbar"><TopAppbar/></nav>

                <div id="div-side-drawer"><SideDrawer/></div>
                <nav id="nav-bottombar"><BottomAppBar/></nav>


            </React.Fragment>

        )
    }
}

BaseApp.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapState2Props = (state) => {
    return state;
};

export default connect(mapState2Props)(withStyles(styles)(withTheme(BaseApp)));