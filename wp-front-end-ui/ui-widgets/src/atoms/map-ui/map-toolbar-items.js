import * as React from "react";
import * as ReactDOM from "react-dom";
import autoBind from "auto-bind";
import {Divider} from "@material-ui/core";
import {Tooltip} from "@material-ui/core";
import {connect, Provider} from "react-redux";
import Menu from "@material-ui/core/Menu";
import LayerAttributeTable from "../layer-ui/layer-attribute-table";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Fullscreen from "react-full-screen";
import DialogActions from "@material-ui/core/DialogActions";


class MapToolbarItems extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            anchorMeasurementEl: null,
            anchorDrawingEl: null,
            openDialog: false,
            isFullScreen: false,
            dialogTitle: "",
            dialogContent: null,
            dialogActions: null,
        }
        this.btnSelectToolRef = React.createRef();
        this.btnDrawingToolRef = React.createRef();
        this.btnMeasuringToolRef = React.createRef();
        this.btnAttributeTableRef = React.createRef();
        this.btnUploadShapeFileRef = React.createRef();
        this.btn3DRef = React.createRef();
    }

    openMeasurementToolMenu(event) {
        this.setState({anchorMeasurementEl: event.currentTarget});
    }

    closeMeasurementToolMenu() {
        this.setState({anchorMeasurementEl: null})
    }

    getMeasurementMenu() {
        let items = [{name: "length", geomType: "1"}, {name: "area", geomType: "2"}]

        let menuItems = [];
        // let items = this.props.userItems;
        for (let i in items) {
            let item = items[i];
            menuItems.push(
                <li key={"key-measurement-" + item.name}
                    style={{"width": "100px", margin: "10px", textAlign: "center"}}>
                    <button className={"btn"} style={{"width": "100px"}} onClick={() => {
                        this.handleMeasurementTool(item.geomType);
                        this.closeMeasurementToolMenu();
                    }}>{item.name}</button>
                </li>
            )
        }
        // return menuItems;
        return (<Menu id="measurement-menu"
                      anchorEl={this.state.anchorMeasurementEl} keepMounted
                      open={Boolean(this.state.anchorMeasurementEl)} onClose={this.closeMeasurementToolMenu}>
            {menuItems} </Menu>);
    }

    openDrawingToolMenu(event) {
        this.setState({anchorDrawingEl: event.currentTarget});
    }

    closeDrawingToolMenu() {
        this.setState({anchorDrawingEl: null})
    }

    getDrawingMenu() {
        let items = [{name: "Point", geomType: "0"}, {name: "Polyline", geomType: "1"}, {
            name: "Polygon",
            geomType: "2"
        }];
        let menuItems = [];
        // let items = this.props.userItems;
        for (let i in items) {
            let item = items[i];
            menuItems.push(
                <li key={"key-drawing-" + item.name}>
                    <button className={"btn"} onClick={() => {
                        this.handleDrawingTool(item.geomType);
                        this.closeDrawingToolMenu();
                    }}>{item.name}</button>
                    <Divider/>
                </li>);
        }
        return (<Menu id="drawing-menu"
                      anchorEl={this.state.anchorDrawingEl} keepMounted
                      open={Boolean(this.state.anchorDrawingEl)} onClose={this.closeDrawingToolMenu}>
            {menuItems} </Menu>);
    }

    handleHomeTool() {
        alert("tool is working...")
    }

    handleAttributeTableTool() {
        // mapOutput.showAttributeTable();
        if (!this.props.openDrawer.outputDrawer && this.props.mainLayerName) {
            let url = this.props.uri + this.props.jqxGridDataURL + this.props.mainLayerName + "/";
            // console.log(url);
            (async () => {
                let response = await fetch(url);
                let res = await response.json();
                if (res.status = "200") {
                    let data = res.payload;
                    this.props.handleOpenOutputDrawer();
                    let layerAttributeTable = <Provider store={this.props.store}> <LayerAttributeTable
                        data={data}/></Provider>
                    ReactDOM.render(layerAttributeTable, document.getElementById('output-div'));
                }
            })();
        } else {
            this.props.handleOpenOutputDrawer();
        }
    }


    handleDrawingTool(drawingType) {
        this.props.olMapVM.addInteraction("DrawingTool", drawingType);
    }

    handleMeasurementTool(drawingType) {
        this.props.olMapVM.addInteraction("MeasuringTool", drawingType);
    }

    handleSelectFeatureTool() {
        this.props.olMapVM.addInteraction("SelectTool");
    }

    showDialogBox(visibility) {
        if (!visibility) visibility = !this.state.openDialog
        this.setState({openDialog: visibility})
    }

    uploadShapeFile() {
        let me = this;
        let form = document.getElementById('form-upload-wmp-station');
        let fileExts = [] //["shp", "shx", "dbf", "prj"]
        let formData = new FormData();
        let shpFile = document.getElementById('shp-file');
        let files = shpFile.files;
        // formData.append('shp-file', files);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let fileExt = file.name.split(".")[1];
            fileExts.push(fileExt)
            formData.append('shp-file-' + i, file, file.name);
        }
        if (!fileExts.includes("shp")) {
            alert("shp file doesn't added. Please add all required files..");
        } else if (!fileExts.includes("dbf")) {
            alert("dbf file doesn't added. Please add all required files..");
        } else if (!fileExts.includes("shx")) {
            alert("shx file doesn't added. Please add all required files..");
        } else if (!fileExts.includes("prj")) {
            alert("prj file doesn't include. We are assuming that data is 4326");
        } else {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", form.action, true)
            xhr.onreadystatechange = function () {
                me.showDialogBox(false)
                if (xhr.readyState == 4 && xhr.status == 200) {
                    alert(xhr.responseText);
                    setTimeout(() => window.location.reload(), 1000);
                } else if (xhr.readyState == 4) {
                    alert("Failed to upload shapefile. Please check log for assistant")
                }
            };
            xhr.send(formData);
        }
    }

    handleUploadShapefileTool() {
        let url = this.props.uri + "/sa/layer/layer_upload/" + this.props.mainLayerName + "/";
        this.setState({dialogTitle: "Select Shapefile"});
        this.showDialogBox(true);
        let fileDropZone = <React.Fragment>
            <form id="form-upload-wmp-station" action={url} method="post"
                  encType="multipart/form-data"
                  target={"_blank"}>
                <input type="file" className={"btn btn-site"} name="file" id="shp-file" multiple
                       accept={".shp,.shx,.dbf,.prj"}/>
            </form>
        </React.Fragment>

        this.setState({dialogContent: fileDropZone})
        let actions = <button className={"btn btn-site"} onClick={this.uploadShapeFile}>
            Upload
        </button>
        this.setState({dialogActions: actions})

    }

    handle3DView() {
        // alert("3D View working...");
        this.props.olMapVM.toogleOLCesium()
    }

    goFullScreen() {
        this.setState({isFullScreen: true});
    }

    getToolbarButtonIcon(name, type = svg) {
        let icon = null;
        try {
            switch (type) {
                case "svg":
                    icon = require(`./icons/svg/${name}-icon.svg`);
                    break;
                case "png":
                    icon = require(`./icons/png/${name}-icon.png`);
                    break;
            }
        } catch (e) {
            icon = require('./icons/png/default-icon.png');
        }
        return icon;
    }


    getToolbarItem(key, disabled = false) {
        const buttonStyle = {height: "30px", width: "30px"}; // backgroundColor:
        const classNames = (disabled ? "disabled" : "");
        let li = null;
        switch (key) {
            case "SelectFeature":
                return (<li key={"tbItem-" + key}>
                    <Tooltip title={"Select Feature by Clicking on It"}>
                        <button ref={this.btnSelectToolRef} style={buttonStyle}>
                            <img height={"30px"} width={"30px"} src={this.getToolbarButtonIcon("select", "svg")}/>
                        </button>
                    </Tooltip>
                </li>)
            case "MeasurementTool":
                return (<li key={"tbItem-" + key}>
                    <Tooltip title={"Measurement Tool"}>
                        <button ref={this.btnMeasuringToolRef} style={buttonStyle}>
                            <img height={"30px"} width={"30px"} src={this.getToolbarButtonIcon("measure-tool", "svg")}/>
                        </button>
                    </Tooltip>
                    {this.getMeasurementMenu()}
                </li>)
            case "DrawFeature":
                return (<li key={"tbItem-" + key} className={classNames}>
                    <Tooltip title={"Draw Feature Geometry on Map"}>
                        <button ref={this.btnDrawingToolRef} style={buttonStyle}>
                            <img height={"30px"} width={"30px"} src={this.getToolbarButtonIcon("drawing-tool", "svg")}/>
                        </button>
                    </Tooltip>
                    {this.getDrawingMenu()}
                </li>);
            case "AttributeTable":
                li = <li key={"tbItem-" + key} className={classNames}>
                    <Tooltip title={"View Attribute Table"}>
                        <button ref={this.btnAttributeTableRef} style={buttonStyle}>
                            <img height={"30px"} width={"30px"} src={this.getToolbarButtonIcon("data-table", "svg")}/>
                        </button>
                    </Tooltip>
                </li>;
                return li;
            case "ShapeFileUploader":
                li = <li key={"tbItem-" + key} className={classNames}>
                    <Tooltip title={"Upload Shapefile"}>
                        <button ref={this.btnUploadShapeFileRef} style={buttonStyle}>
                            <img height={"30px"} width={"30px"} src={this.getToolbarButtonIcon("file-upload", "png")}/>
                        </button>
                    </Tooltip>
                </li>;
                return li;
            case "3D":
                li = <li key={"tbItem-" + key} className={classNames}>
                    <Tooltip title={"3D View"}>
                        <button ref={this.btn3DRef} style={buttonStyle}>
                            <img height={"30px"} width={"30px"} src={this.getToolbarButtonIcon("globe", "png")}/>
                        </button>
                    </Tooltip>
                </li>;
                return li;

        }
    }

    componentDidMount() {
        this.btnUploadShapeFileRef.current.addEventListener('click', this.handleUploadShapefileTool);
        this.btnSelectToolRef.current.addEventListener('click', this.handleSelectFeatureTool);
        this.btnMeasuringToolRef.current.addEventListener('click', this.openMeasurementToolMenu);
        this.btnDrawingToolRef.current.addEventListener('click', this.openDrawingToolMenu);
        this.btnAttributeTableRef.current.addEventListener('click', this.handleAttributeTableTool);
        this.btn3DRef.current.addEventListener('click', this.handle3DView);
    }

    render() {
        // const toolbarItemsNames = ["SelectFeature", "MeasurementTool", "DrawFeature", "AttributeTable", "ShapeFileUploader"]; //["SelectFeature", "MeasurementTool", "DrawFeature"];
        const toolbarItemsNames = ["SelectFeature", "MeasurementTool", "DrawFeature", "AttributeTable", "ShapeFileUploader", "3D"];
        // const layerDependentItems = ["AttributeTable", "DrawFeature"]
        let toolbarItems = []
        for (var i = 0; i < toolbarItemsNames.length; i++) {
            let disabled = false;
            // if (layerDependentItems.indexOf(toolbarItemsNames[i]) != -1 && !this.props.mainLayerName) {
            //     disabled = true;
            // }
            toolbarItems.push(this.getToolbarItem(toolbarItemsNames[i], disabled));
        }
        return (
            <React.Fragment>
                <ul className={"toolbar-list"}>
                    {toolbarItems}
                </ul>
                <Dialog open={this.state.openDialog}
                        onClose={() => this.handelDialogVisibility(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogTitle id="map-alert-dialog-title">{this.state.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <Fullscreen
                            enabled={this.state.isFullScreen}
                            onChange={(isFullScreen) => this.setState({isFullScreen})}>
                            <div style={{width: "100%", height: "100%", backgroundColor: "white", overflow: "auto"}}
                                 id="map-alert-dialog-content">
                                {this.state.dialogContent}
                            </div>
                        </Fullscreen>
                    </DialogContent>
                    <DialogActions id={"map-alert-dialog-actions"}>
                        {this.state.dialogActions}
                        <button className={"btn btn-site"} onClick={this.goFullScreen}>
                            Full Screen
                        </button>
                        <button className={"btn btn-site"} onClick={() => this.showDialogBox(false)}
                                color="primary" autoFocus>
                            Close
                        </button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

// export default MapToolbarItems
const mapStateToProps = (state) => {
    return state;
}
const mapDispatchToProps = (dispatch) => {
    return {
        handleOpenOutputDrawer() {
            dispatch({type: 'TOGGLE_DRAWER', drawerKey: 'outputDrawer'})
            dispatch({type: 'MAP_OUTPUT_TYPE', mapOutputType: ""})
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MapToolbarItems);

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTheme(MapToolbarItems)));