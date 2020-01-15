import {createMuiTheme} from "@material-ui/core/styles";

import {IconButton, Button, styled, Menu} from "@material-ui/core";

const statusbarHeight = 25;
const toolbarHeight = 65;
let spacing = 0;
const drawerWidth = 240;
// const maincontentHeight = 'calc( 100vh - ' + toolbarHeight + ' - ' + statusbarHeight + ' )'
const appbarColor1 = '#547c60';
const appbarColor2 = '#245d40';
const appbarColor3 = '#245d40';
const appDefaultColor = '#7c9884';//'#3f5f48';
const color = 'white';
export const appTheme = createMuiTheme({
    palette: {
        primary: {main: appDefaultColor},
        secondary: {main: '#11cb5f'},

    },
});

const appBar = (theme) => ({
    background: 'linear-gradient(90deg, ' + appbarColor1 + ' 40%, ' + appbarColor2 + ' 80%, ' + appbarColor3 + ')',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
    color: 'white',
    padding: '0 30px',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
});
export const DAIconButton = styled(IconButton)({
    color: "white"
});

// export const DAContainer = styled(Container)({
//     backgroundColor: appDefaultColor,
//     padding: '30px',
//     minHeight: `calc(100vh - ${toolbarHeight}px - ${statusbarHeight}px)`,
// });
// export const DropDownMenu = styled(Menu)({
//     elevation: 0,
//     getContentAnchorEl: null,
//     anchorOrigin: {
//         vertical: 'bottom',
//         horizontal: 'center',
//     },
//     transformOrigin: {
//         vertical: 'top',
//         horizontal: 'center',
//     }
// });
export const DAButton = styled(Button)({
    background: appDefaultColor,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(22, 22, 22, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
});


export const styles = (theme) => {
    // alert(theme.spacing(1));
    return ({
        root: {
            display: 'flex',
            flexGrow: 1,
            padding: '0px !important',
            margin: '0px !important',
            minHeight: `calc(100vh - ${toolbarHeight}px - ${statusbarHeight}px  )`,
            // backgroundColor: '#7a928187'
            // height: '100%',
        },
        container: {
            backgroundColor: appDefaultColor,
            padding: '30px',
            minHeight: `calc(100vh - ${toolbarHeight}px - ${statusbarHeight}px)`,
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),

            width: 200,
        },
        logo: {
            height: toolbarHeight - 15,
            marginRight: '15px'
        },
        close: {
            padding: theme.spacing(0.5),
        },
        hide: {
            display: 'none',
        },
        title: {
            flexGrow: 1,
            fontSize: '0.9rem',
            color: '#ffffff'
        },
        bottomTitle: {
            flexGrow: 1,
            textAlign: 'center',
            fontSize: '0.7rem',
        },
        // bottomA: {
        //     color: 'beige !important',
        //     fontSize: '0.7rem',
        // },

        dialogTitle: {
            backgroundColor: appDefaultColor,
            // color: "#ffffff",
        },
        appBar: {
            // ...appBar(theme)
            backgroundColor: appDefaultColor,
        },
        appBarTop: {
            ...appBar(theme),
            height: toolbarHeight + '!important',
            position: 'fixed',
            top: '0px',

        },
        appBarBottom: {
            ...appBar(theme),
            top: 'auto',
            bottom: '0px',
            height: statusbarHeight,
            flexGrow: 1,
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },

        // menuButton: {
        //     marginRight: theme.spacing(2),
        // },
        menuButton: {
            marginRight: 36,
        },

        drawer: {
            // width: '20px !important',
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),

            ...theme.mixins.toolbar,
        },
        drawerPaper: {
            width: drawerWidth + 3,
            height: '100%',

        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            color: color,
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            backgroundColor: appbarColor1,
            minHeight: toolbarHeight + "px !important"
        },
        drawerFooter: {
            // position:'absolute',
            height: statusbarHeight,
            color: color,
            backgroundColor: appbarColor1,
            bottom: 0,
            // top:'auto',
        },
        drawerSideNavbar: {
            width: drawerWidth - 1,
            height: '100vh',
            overflowY: 'auto',
            margin: '0px',
            padding: '0px',
            backgroundColor: appDefaultColor
        },
        drawerLayerSwitcher: {
            width: drawerWidth,
            height: '100vh',
            overflowY: 'auto',
            backgroundColor: '#7a928187'
        },
        paperAnchorBottom: {
            zIndex: 1250,
            height: '250px !important'
        },

        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }
    });
}

