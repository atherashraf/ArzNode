import autoBind from "auto-bind";
import $ from "jquery";
import * as ReactDOM from "react-dom";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip";
import JqxButton from "jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons";
import * as React from "react";

// import "jqwidgets-scripts/jqwidgets/jqx-all"
// const jqxCore = require('jqwidgets-scripts/jqwidgets/jqxcore');
// const jqxCore = require('jqwidgets-scripts/jqwidgets/jqxgrid');
// import JqxGrid, {jqx} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid";


class InfoGridVM {
    toolbarButtonsInfo;
    myGrid;
    jqxTheme;
    height;
    width;
    columns;
    dataAdapter;

    constructor() {
        autoBind(this);
    }

    initInfoGrid(props) {
        this.toolbarButtonsInfo = props.toolbarButtonsInfo;
        this.height = (props.height ? props.height : '248px');
        this.width = (props.width ? props.width : '99.7%');
        this.jqxTheme = (props.jqxTheme? props.jqxTheme: "light");
        this.dataAdapter = this.createDataAdapter(props.fields, props.data)
        this.columns = this.setDefaultColumnProperties(props.columns, props.fields);
        this.myGrid = $("#" + props.targetId);
        this.myGrid.jqxGrid({
            width: this.width, height: this.height, theme: this.jqxTheme,
            columns: this.columns, source: this.dataAdapter,
            sortable: true, altrows: true, groupable: true, enabletooltips: true,
            selectionmode: 'singlerow', autoshowfiltericon: true, filterable: true, showfilterrow: true,
            showtoolbar: true, rendertoolbar: this.renderToolbar
        })
    }

    createDataAdapter(fields, data) {
        let dataFields = fields;
        let localData = data;
        const source = {
            datafields: dataFields,
            datatype: 'local',
            localdata: localData
        };
        const dataAdapter =  null ; //new $.jqx.dataAdapter(source);
        return dataAdapter
    }

    setDefaultColumnProperties(columns,fields) {
        const defaultColumnProperties = (col) => {
            if (!col.filtertype) {
                let index = fields.findIndex(x => x.name === col.datafield);
                let dataType = fields[index].type
                let filterType = 'checkedlist';
                switch (dataType) {
                    case 'number':
                        filterType = 'number';
                        break;
                    case 'date':
                        filterType = 'range';
                        break;
                }

                return {
                    filtertype: filterType
                }
            }
        };
        columns = columns.map(c => ({...c, ...defaultColumnProperties(c)}));
        return columns
    }

    handleToolbarButtonClick(btnInfo, event) {
        switch (btnInfo.type) {
            case 'excel':
                this.myGrid.exportdata('xls', 'jqxGrid');
                break;
            case 'pdf':
                this.myGrid.exportdata('pdf', 'jqxGrid');
                break;
            case 'callback':
                btnInfo.callback();
                break;
            case 'row':
                const selectedRowIndex = this.myGrid.getselectedrowindex();
                const rowscount = this.myGrid.getdatainformation().rowscount;
                if (selectedRowIndex >= 0 && selectedRowIndex < parseFloat(rowscount)) {
                    const id = this.myGrid.getrowid(selectedRowIndex);
                    const selectedRowData = this.myGrid.getrowdata(selectedRowIndex);
                    btnInfo.callback(event, id, selectedRowData, btnInfo.params);
                } else {
                    alert("Please select any row")
                }
                break;
        }
    };

    renderToolbar(toolbar) {
        const style = {float: 'left', marginLeft: '5px'};
        const container = $("<div style={{overflow: 'hidden', position: 'relative', margin: '5px'}}></div>");
        this.toolbarButtonsInfo.forEach((btnInfo) => {
            const tooltipContent = btnInfo.tooltip;
            const buttonDiv = $("<div style='float: left; margin-left: 5px;'></div>");
            const buttonIcon = $(`<img style='position: relative; margin-top: 2px;' src=${this.getToolbarButtonIcon(btnInfo.icon)}/>`)
            buttonDiv.append(buttonIcon);
            buttonDiv.jqxTooltip({content: tooltipContent, position: 'mouse', name: 'toolbarButtonTooltip'});
            container.append(buttonDiv);
            buttonDiv.jqxButton({widht: 32, height: 32,})
            buttonDiv.click(function (event) {
                this.handleToolbarButtonClick(btnInfo, event)
            });

        });
    };

    getToolbarButtonIcon(type) {
        let icon = null;
        try {
            icon = require(`./icon/${type}-icon.png`);
        } catch (e) {
            icon = require('./icon/default-icon.png');
        }
        return icon;
    }


}

export default InfoGridVM;