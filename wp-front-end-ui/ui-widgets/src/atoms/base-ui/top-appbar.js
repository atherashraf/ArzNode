import React from "react";
import {withStyles} from '@material-ui/core';
import {DAIconButton, styles} from "../../molecules/static/styles/materialui-styles";
import PropTypes from "prop-types";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {connect} from "react-redux";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuIcon from '@material-ui/icons/Menu';
import {AccountCircle} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SignInForm from "./sigin-form";
import autoBind from "auto-bind";
import {Divider} from "@material-ui/core";


class TopAppbar extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.myRef = React.createRef();
        this.state = {
            anchorEl: null
        }
        // this.getAccountIcon = this.getAccountIcon.bind(this);
        // this.openSignedInMenu = this.openSignedInMenu.bind(this);
        // this.closeSignedInMenu = this.closeSignedInMenu.bind(this);
        // this.signedOut = this.signedOut.bind(this);
        // this.getUserMenu = this.getUserMenu.bind(this);
    }

    openSignedInMenu(event) {
        this.setState({anchorEl: event.currentTarget});
    }

    closeSignedInMenu() {
        this.setState({anchorEl: null})
    }

    signedOut() {
        let me = this;
        let user = this.props.userInfo
        const formData = new FormData();
        formData.append('username', user.user_name);
        formData.append('session_key', user.session_key);

        if (user) {
            let url = this.props.uri + this.props.accountsURL + "logout/";
            (async () => {
                let response = await fetch(url, {
                    method: 'POST',
                    // method: 'PUT',
                    body: formData
                });
                let data = await response.json();
                console.log(data);
                if (data.status == 200) {
                    this.props.handleSignedOut();
                    this.closeSignedInMenu();
                }
                this.props.showMessage(data.payload.message)
            })();
        }

    }

    getUserMenu(items) {
        let menuItems = [];
        // let items = this.props.userItems;
        for (let i in items) {
            let item = items[i];
            menuItems.push(
                <MenuItem key={"key-"+item.name} >
                    <i className={item.icon}> <a style={{color:"#222222", textDecoration:"None"}} href={this.props.uri+ item.href}>{item.name}</a></i>
                    <Divider/>

                </MenuItem>

            )
            // menuItems.push(<MenuItem key={"key-" + item.name} onClick={this.signedOut}>{item.name}</MenuItem>);
        }
        return menuItems;
    }
    openLoginForm(){
         let url = this.props.uri + this.props.accountsURL + "login/?next="+this.props.nextPage;
         window.open(url,"_self");
    }
    getAccountIcon() {
        let me = this;

        if (!this.props.userInfo || Object.keys(this.props.userInfo).length === 0) {
            return (<Tooltip title="Click to Sign In">
                {/*<DAIconButton aria-label="Login" onClick={() => this.props.handleSignedIn("Welcome...")} color="inherit">*/}
                <DAIconButton aria-label="Login"  onClick={this.openLoginForm}>

                    <Icon className="fa fa-sign-in" color="inherit"/>
                </DAIconButton>
            </Tooltip>)
        } else {
            let title = "Welcome " + this.props.userInfo.user_name;
            return (<div>
                <Tooltip title={title}>
                    <DAIconButton aria-label="Login"  onClick={this.openSignedInMenu} >
                        <AccountCircle/>
                    </DAIconButton>
                </Tooltip>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.closeSignedInMenu}
                >
                    {this.getUserMenu(this.props.userItems)}
                </Menu>
            </div>)
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="static"
                        className={clsx(classes.appBarTop, {
                            [classes.appBarShift]: this.props.openSidebar,
                        })}>
                    <Toolbar>
                        <DAIconButton
                            // color="inherit"
                            aria-label="open drawer"
                            onClick={this.props.handleToggleSidebar}
                            edge="start"
                            className={clsx(classes.colorInherit, classes.menuButton, {
                                [classes.hide]: this.props.open,
                            })}>
                            <MenuIcon/>
                        </DAIconButton>
                        <img style={{height:"50px", marginRight:"15px"}} src={this.props.logoPath}/>
                        <Typography variant="h6" className={classes.title}> Snow Avalanche </Typography>
                        {this.getAccountIcon()}
                    </Toolbar>
                </AppBar>
                <SignInForm/>
            </div>

        )
    }

}

TopAppbar.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapState2Props = (state) => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleToggleSidebar() {
            dispatch({type: 'TOGGLE_SIDEBAR'})
        },
        handleSignedIn(msg) {
            dispatch({type: 'OPEN_SIGNED_IN_FORM'})
        },
        handleSignedOut() {
            dispatch({type: 'SIGNED_OUT'})
        },
        showMessage(msg) {
            dispatch({type: 'OPEN_SNACKBAR', message: msg})
        }
    }
}
export default connect(mapState2Props, mapDispatchToProps)(withStyles(styles)(TopAppbar));
// export default connect(mapState2Props, mapDispatchToProps)(TopAppbar);