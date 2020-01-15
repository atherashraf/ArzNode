import * as React from "react";
import Fullscreen from "react-full-screen";
import fullScreenIcon from "../../molecules/static/icons/full-screen.svg";
import autoBind from "auto-bind";


class DialogBox extends React.Component {
    constructor(props) {
        super(props);
        this.modalContentRef = React.createRef();
        this.modalBodyRef = React.createRef();
        this.modalHeaderRef = React.createRef();
        autoBind(this)
        this.state = {
            isFullScreen: false,
            dialogDisplay: "none",
            contentHeight: this.props.height,
            contentWidth: this.props.width,
        }

    }

    componentDidMount() {
        // let container = document.getElementById(this.props.containerId);
        // container.style.height = "1000px";
        // container.style.width = "100%";
        // this.modalBodyRef.current.appendChild(container);
        // this.setState({
        //     bodyHeight: this.props.height,
        //     bodyWidth: this.props.width,
        // })
    }

    handelDialogVisibility(display) {
        display = (display ? display : (this.state.dialogDisplay == "none" ? "block" : "none"));
        this.setState({
            dialogDisplay: display
        })
        let container = document.getElementById(this.props.containerId);
        container.style.display="block";
        this.modalBodyRef.current.appendChild(container);
    }

    goFullScreen() {
        this.setState({isFullScreen: true});
    }

    handelFullScreenOnChange(isFullScreen) {
        this.setState({isFullScreen});
        if (isFullScreen) {
            this.setState({
                contentWidth: "100%",
                contentHeight: "100vh"
            })

        } else {
            this.setState({
                contentWidth: this.props.width,
                contentHeight: this.props.height
            })
        }
    }

    render() {
        return (
            <div id="myModal" className="modal" style={{display: this.state.dialogDisplay}}>
                <Fullscreen
                    enabled={this.state.isFullScreen}
                    onChange={this.handelFullScreenOnChange}>

                    <div ref={this.modalContentRef} id={"modal-content"} className="modal-content"
                         style={{width: this.state.contentWidth, minHeight: this.state.contentHeight}}>
                        <div ref={this.modalHeaderRef} className="modal-header">
                            <h4>Modal Header</h4>
                            <span className={"close"}>
                                <button className={"btn btn-site"} onClick={this.goFullScreen}> /
                                    <img height={"20px"} width={"20px"} src={fullScreenIcon}/>
                                </button>
                                <button className="btn btn-site"
                                        onClick={() => this.handelDialogVisibility("none")}>&times;</button>

                            </span>

                        </div>
                        <div ref={this.modalBodyRef} className="modal-body">
                            {/*<div >Some text in the Modal..</div>*/}
                        </div>
                        <div className="modal-footer"></div>
                    </div>
                </Fullscreen>
            </div>
        )
    }
}

export default DialogBox;