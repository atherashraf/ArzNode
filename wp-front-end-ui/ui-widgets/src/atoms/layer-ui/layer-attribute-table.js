// import InfoJqxGridCmp from "../jqx-widgets/info-jqx-grid-cmp";
import * as React from "react";
import {connect} from "react-redux";
import autoBind from "auto-bind";
import {Suspense} from "react";
const InfoJqxGridCmp = React.lazy(() => import(/* webpackChunkName: "Info-grid" */
        `../jqx-widgets/info-jqx-grid-cmp`));

// import InfoGridVm from "../jqx-widgets/info-grid-vm";

class LayerAttributeTable extends React.PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    zoomToFeature(event, id, selectedRowData, params) {
        // alert(JSON.stringify(selectedRowData));
        let fid = selectedRowData[params.pkCol];
        let feature = this.props.olMapVM.getFeatureByPk(this.props.mainLayerName, fid);
        let extent = feature.getGeometry().getExtent();
        this.props.olMapVM.zoomToExtent(extent);
        let selectTool = this.props.olMapVM.getCustomInteraction("SelectTool");
        selectTool.selectFeature(feature)

    }

    editFeature(event, id, selectedRowData, params) {
        let index = this.props.initLayers.findIndex(lyr => lyr.layerName == this.props.mainLayerName)
        if (this.props.initLayers[index].modelName) {
            let appLabel = this.props.initLayers[index].appLabel;
            let modelName = this.props.initLayers[index].modelName;
            let url = `${this.props.uri}/spatial_data_admin/${appLabel}/${modelName}/${selectedRowData[params.pkCol]}/change/?next=${window.location.href}`;
            window.open(url, "_self");
        } else {
            alert("cannot edit data");
        }
    }


    getToolbarButtons() {
        let buttons = [
            {id: "xls", type: "excel", tooltip: "Download grid in excel", icon: "excel"},
            {id: "pdf", type: "pdf", tooltip: "Download grid in pdf format", icon: "pdf"},
            {
                id: "zoom", type: "row", tooltip: "Zoom to selected feature", icon: "zoom-in",
                callback: this.zoomToFeature, params: {pkCol: this.props.data.pk_col}
            },
            {
                id: "edit", type: "row", tooltip: "Edit selected feature", icon: "edit",
                callback: this.editFeature, params: {pkCol: this.props.data.pk_col}
            }

        ]
        return buttons;
    }


    render() {
        let {data} = this.props;
        let btnInfo = this.getToolbarButtons();
        return (
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <InfoJqxGridCmp fields={data.fields} columns={data.columns} data={data.data}
                                    theme={this.props.jqxTheme} toolbarButtonsInfo={btnInfo}/>
                </Suspense>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state
}
export default connect(mapStateToProps)(LayerAttributeTable);