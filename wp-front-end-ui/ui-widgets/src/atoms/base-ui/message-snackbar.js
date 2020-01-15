import React from 'react';
import {withStyles} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {styles} from "../../molecules/static/styles/materialui-styles";

class MessageSnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnackbar: true
        }
    }

    toggleSnackbar(visibility) {
        if (!visibility) visibility = !this.state.openSnackbar
        this.setState({openSnackbar: visibility})
    }

    render() {
        const {classes} = this.props;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.openSnackbar}
                // autoHideDuration={6000}
                onClose={() => this.toggleSnackbar(false)}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.props.snackbarMessage}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={() => this.toggleSnackbar(false)}
                    >
                        <CloseIcon/>
                    </IconButton>,
                ]}
            />
        )
    }
}

export  default withStyles(styles)(MessageSnackbar)
// const mapState2Props = (state) => {
//     return state;
// };
// const mapDispatchToProps = (dispatch) => {
//     return {
//         handleCloseSnackbar() {
//             dispatch({type: 'CLOSE_SNACKBAR'})
//         }
//     }
// }
// export default connect(mapState2Props, mapDispatchToProps)(withStyles(styles)(MessageSnackbar));