import styles from '../../molecules/static/styles/materialui-styles';
import {connect} from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import {withStyles, withTheme} from "@material-ui/core";
import * as React from "react";

class MapStatusbar extends React.Component{
    render(){
        const {classes} = this.props;
        return(
            <div className={classes.root}>
                    <AppBar position="fixed" color="primary" className={classes.appBarBottom}>
                </AppBar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        handleCloseMapTOC() {
            dispatch({type: 'CLOSE_TOC'})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapStatusbar))
