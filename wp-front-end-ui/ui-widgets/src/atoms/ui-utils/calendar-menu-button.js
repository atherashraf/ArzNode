import React from "react";
// import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import autoBind from "auto-bind";

class CalendarMenuButton extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.calenderRef = React.createRef();
        this.state = {
            anchorEl: null
        }
    }

    setAnchorEl(target) {
        this.setState({anchorEl: target})
    }

    handleClick(event) {
        this.setAnchorEl(event.currentTarget);
    };

    handleClose() {
        this.setAnchorEl(null);
    };

    render() {
        return (
            <div>
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={this.handleClick}> Open Menu
                </Button>
                <Menu
                    id="customized-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                    elevation={0}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}>
                    <MenuItem>
                        <ListItemIcon>
                            <SendIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Sent mail"/>
                    </MenuItem>
                </Menu>
            </div>
        )
    }
}

export default CalendarMenuButton;