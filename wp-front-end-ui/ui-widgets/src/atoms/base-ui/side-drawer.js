import * as React from 'react';
import clsx from 'clsx';
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import {withStyles, withTheme} from '@material-ui/core';
import {styles} from "../../molecules/static/styles/materialui-styles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {connect} from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

class SideDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variant: this.getVariantType()
        }
        this.handleResize = this.handleResize.bind(this);
    }

    getVariantType() {
        return (window.innerWidth > 400 ? "permanent" : "persistant")
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
    }

    handleResize() {
        this.setState({
            variant: this.getVariantType()
        });
    }

    showNavItems() {
        let navItems = [];
        let {classes} = this.props;
        for (let i in this.props.navItems) {
            let navItem = this.props.navItems[i];
            let iconColor = (navItem.color ? navItem.color : "#00000088");
            let item = <Tooltip key={"SideNav-Tooltip" + i} title={navItem.name}>
                <ListItem key={"SideNav-ListItem" + i} button component="a" href={navItem.href}>

                    <ListItemIcon>
                        <Icon className={navItem.icon} style={{color: iconColor}}/>
                    </ListItemIcon>
                    <span style={{color: "black"}}>{navItem.name}</span>
                </ListItem>
            </Tooltip>
            navItems.push(item)
        }
        return navItems;
    }


    render() {
        let me = this;
        const {classes} = this.props;
        const {theme} = this.props;

        return (
            <Drawer
                variant={this.state.variant}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: this.props.openSidebar,
                    [classes.drawerClose]: !this.props.openSidebar,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: this.props.openSidebar,
                        [classes.drawerClose]: !this.props.openSidebar,
                    }),
                }}
                open={this.props.openSidebar}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.props.handleToogleSidebar}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <div className={classes.drawerSideNavbar}>
                    <List component="nav" aria-label="main mailbox folders">
                        {me.showNavItems()}
                    </List>
                </div>
                <div className={classes.drawerFooter}>
                </div>
            </Drawer>
        )
    }
}

SideDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapState2Props = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        handleToogleSidebar() {
            dispatch({type: 'TOGGLE_SIDEBAR'})
        }

    }
}
export default connect(mapState2Props, mapDispatchToProps)(withStyles(styles)(withTheme(SideDrawer)));