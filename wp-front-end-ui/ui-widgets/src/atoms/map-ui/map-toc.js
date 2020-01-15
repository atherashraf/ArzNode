import * as React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {connect} from "react-redux";
import styles from '../../molecules/static/styles/materialui-styles';


class MapTOC extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.olMapVM.addLayerSwitcher(this.props.layerSwitcherTargetID)
    }

    render() {
        const {classes} = this.props;
        const {theme} = this.props;
        return (
            <div className={classes.root}>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={this.props.openTOC}
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    {/*<div className={classes.drawerHeader}  style={{"minHeight": this.props.headerHeight}}>*/}
                    <div className={classes.drawerHeader}>
                        Table of Contents
                        <IconButton style={{color: "inherit"}} onClick={this.props.handleCloseMapTOC}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                            {/*{this.props.olMapVM.addLayerSwitcher(this.props.layerSwitcherTargetID)}*/}
                        </IconButton>
                    </div>
                    <Divider/>
                    <div id={this.props.layerSwitcherTargetID} className={classes.drawerLayerSwitcher}>
                    </div>
                    <Divider/>
                    <div className={classes.drawerFooter}>
                    </div>
                </Drawer>
            </div>
        )
    }
}

MapTOC.propTypes = {
    classes: PropTypes.object.isRequired,
};


// export default withStyles(styles)(MapTOC);

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(MapTOC)))
