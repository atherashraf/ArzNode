import * as React from "react";
import {connect} from "react-redux";
import {withStyles, withTheme} from '@material-ui/core/styles';
import {styles} from "../../molecules/static/styles/materialui-styles";
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import autoBind from "auto-bind";

// import * as $ from "jquery";

class SignInForm extends React.PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);

    }

    submitLogin() {
        let me = this;
        let url = this.props.uri + this.props.accountsURL + "login/";
        const formData = new FormData();
        let txtUser = document.querySelector("#id_username");
        let txtPass = document.querySelector('#id_password');
        formData.append(txtUser.name, txtUser.value);
        formData.append(txtPass.name, txtPass.value);
        formData.append('csrfmiddlewaretoken', this.props.csrf_token);
        (async () => {
            let response = await fetch(url, {
                method: 'POST',
                // method: 'PUT',
                // headers: {"X-CSRFToken": this.props.csrf_token},
                body: formData,
                credentials: 'same-origin',
            });
            let data = await response.json();
            console.log(data);
            if (data.status == 200) {
                this.props.handleSignedIn(data.payload);
                this.props.handleCloseSignInForm()

            } else {
                this.props.handleLoggedFailed()
            }

        })();
    }

    render() {
        const {classes} = this.props
        let url = this.props.uri + this.props.accountsURL + "login/";
        return (

            <Dialog open={this.props.openSignedInForm} onClose={this.props.handleCloseSignInForm}
                    aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
                    <span className={classes.title}> Sign In </span>
                </DialogTitle>
                <form action={url} method={"POST"}>
                    <DialogContent>
                        <TextField  // autoFocus // type="email"
                            margin="dense" id="id_username"
                            name="username" label="User Name" fullWidth
                        />
                        <TextField
                            margin="dense" id="id_password" label="Password"
                            name="password" type="password" fullWidth
                        />
                        <input type="hidden" name="csrfmiddlewaretoken" value={this.props.csrf_token}/>
                    </DialogContent>
                    <DialogActions>
                        {/*<Button onClick={this.props.handleCloseSignInForm} color="primary">*/}
                        {/*    Cancel*/}
                        {/*</Button>*/}
                        {/*onClick={this.submitLogin}*/}
                        {/*<Button type={"submit"} color="primary">*/}
                        {/*    Submit*/}
                        {/*</Button>*/}
                        <Button type={"submit"} value={"Submit"}>Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>

        );
    }
}

SignInForm.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapState2Props = (state) => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleCloseSignInForm() {
            dispatch({type: 'CLOSE_SIGNED_IN_FORM'})
        },
        handleSignedIn(payload) {
            dispatch({type: 'SIGNED_IN', data: payload})
            dispatch({type: 'OPEN_SNACKBAR', message: "Welcome..." + payload.user.username})
        },
        handleLoggedFailed() {
            dispatch({type: 'OPEN_SNACKBAR', message: "Login failed... Please try again"});
        }
    }
}
export default connect(mapState2Props, mapDispatchToProps)(withStyles(styles)(withTheme(SignInForm)));