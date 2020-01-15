import * as React from 'react';
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/core';
import {styles} from "../../molecules/static/styles/materialui-styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import {connect} from "react-redux";
import clsx from "clsx";

class BottomAppbar extends React.Component {

    render() {
        const {classes} = this.props;
        const aStyle ={
            color: 'beige !important',
            fontSize: '0.7rem !important'
        }
        return (
            <React.Fragment>
                <AppBar position="fixed" color="primary" className={clsx(classes.appBarBottom, {
                            [classes.appBarShift]: this.props.openSidebar,
                        })}>
                    <Typography className={classes.bottomTitle}>
                        <a href={"http://digitalarz.info"} target={"_blank"}>
                            <span style={{color: 'beige', fontSize: '0.7rem'}}>Developed by Dr. Ather Ashraf</span>
                        </a>
                    </Typography>
                </AppBar>
            </React.Fragment>
        );
    }

}

BottomAppbar.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapState2Props = (state) => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleToogleSidebar() {
            dispatch({type: 'TOGGLE_SIDEBAR'})
        }

    }
}
export default connect(mapState2Props, mapDispatchToProps)(withStyles(styles)(BottomAppbar));