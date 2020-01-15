import * as React from 'react';
import * as ReactDOM from "react-dom";
import JqxGrid, {IGridProps, jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxTooltip from "jqwidgets-scripts/jqwidgets-react-tsx/jqxtooltip";
import './styles/jqx.base.css'
import './styles/jqx.dagreen.css'
import autoBind = require("auto-bind");


export interface IInfoGridProps {
    fields: any,
    columns: any,
    data: any,
    theme: string,
    height: string,
    width: string,
    toolbarButtonsInfo: any
}

class InfoJqxGridCmp extends React.PureComponent<{}, IGridProps> {
    private myGrid = React.createRef<JqxGrid>();
    private toolbarButtonsInfo: any = null;
    private jqxTheme = "light";

    constructor(props: IInfoGridProps) {
        super(props);
        // this.excelBtnOnClick = this.excelBtnOnClick.bind(this);
        // this.pdfBtnOnClick = this.pdfBtnOnClick.bind(this);
        // this.rendertoolbar = this.rendertoolbar.bind(this);
        autoBind(this);
        this.toolbarButtonsInfo = props.toolbarButtonsInfo;
        //@ts-ignore
        let initHeight = (this.props.height ? this.props.height : '100%');
        //@ts-ignore
        let initWidth = (this.props.width ? this.props.width : '99.7%');
        const source = this.setDataSource(props.fields, props.data);
        const columns = this.setDefaultColumnProperties(props.columns);
        this.state = {
            theme: this.jqxTheme,
            height: initHeight,
            width: initWidth,
            columns: columns,
            source: new jqx.dataAdapter(source),
            rendertoolbar: this.rendertoolbar
        }

    }

    public setJQXTheme(jqxTheme: string) {
        this.jqxTheme = jqxTheme;
        this.setState({
            theme: jqxTheme
        });
    }

    public setToolbarButtonInfo(toolbarButtonInfo: []) {
        this.toolbarButtonsInfo = toolbarButtonInfo;
        this.setState({
            rendertoolbar: this.rendertoolbar
        })
    }

    public changeGridData(fields: [], columns: [], data: []) {
        const source = this.setDataSource(fields, data);
        columns = this.setDefaultColumnProperties(columns);
        this.setState({
            columns: columns,
            source: new jqx.dataAdapter(source),
        })
    }

    public rendertoolbar(toolbar: any): void {
        const style: React.CSSProperties = {float: 'left', marginLeft: '5px'};
        const btnDivs: any = [];
        this.toolbarButtonsInfo.forEach((btnInfo: any) => {
            btnDivs.push(<div key={btnInfo.id} id={btnInfo.id} style={style}/>)
        });
        const buttonsContainer = (
            <div style={{overflow: 'hidden', position: 'relative', margin: '5px'}}>
                {btnDivs}
            </div>
        );
        ReactDOM.render(buttonsContainer, toolbar[0]);

    };

    public setDataSource(fields: [], data: []) {

        let dataFields = fields;
        let localData = data;
        const source: any = {
            datafields: dataFields,
            datatype: 'local',
            localdata: localData
        };
        return source
    }

    public setDefaultColumnProperties(columns: []) {
        const defaultColumnProperties = (col: {}) => {
            //@ts-ignore
            if (!col.filtertype) {
                //@ts-ignore
                let index = this.props.fields.findIndex(x => x.name === col.datafield);
                //@ts-ignore
                let dataType = this.props.fields[index].type
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
        //@ts-ignore
        columns = columns.map(c => ({...c, ...defaultColumnProperties(c)}));
        return columns
    }

    private getToolbarButtonIcon(type: string) {
        let icon = null;
        try {
            icon = require(`./icon/${type}-icon.png`);
        } catch (e) {
            icon = require('./icon/default-icon.png');
        }
        return icon;
    }

    public componentDidMount() {
        setTimeout(() => {
            this.createToolbarButtons();
        });
    }

    private excelBtnOnClick() {
        this.myGrid.current!.exportdata('xls', 'jqxGrid');
    };

    private pdfBtnOnClick() {
        this.myGrid.current!.exportdata('pdf', 'jqxGrid');
    };

    private createToolbarButtons(): void {
        const callBackFunction = (btnInfo?: any, event?: any) => {
            switch (btnInfo.type) {
                case 'excel':
                    this.excelBtnOnClick();
                    break;
                case 'pdf':
                    this.pdfBtnOnClick();
                    break;
                case 'callback':
                    btnInfo.callback();
                    break;
                case 'row':
                    const selectedRowIndex = this.myGrid.current!.getselectedrowindex();
                    const rowscount = this.myGrid.current!.getdatainformation().rowscount;
                    if (selectedRowIndex >= 0 && selectedRowIndex < parseFloat(rowscount)) {
                        const id = this.myGrid.current!.getrowid(selectedRowIndex);
                        const selectedRowData = this.myGrid.current!.getrowdata(selectedRowIndex);
                        btnInfo.callback(event, id, selectedRowData, btnInfo.params);
                    } else {
                        alert("Please select any row")
                    }
                    break;
            }
        };
        this.toolbarButtonsInfo.forEach((btnInfo: any) => {
            let buttonClick = (event?: any) => {
                callBackFunction(btnInfo, event)
            };

            ReactDOM.render(
                <JqxTooltip position={"mouse"} name={"moveTooltip"}
                            content={btnInfo.tooltip}>
                    <JqxButton key={"jqxBtn" + btnInfo.id} onClick={buttonClick} theme={this.state.theme}
                               width={32} height={32}
                               imgSrc={this.getToolbarButtonIcon(btnInfo.icon)}
                        // imgSrc={"/static/components/icon/" + btnInfo.icon}
                               imgPosition={'center'} textPosition={'center'} textImageRelation={'imageBeforeText'}/>
                </JqxTooltip>,
                document.getElementById(btnInfo.id)
            );

        });

    }


    public render() {
        let totalWidth = 35;
        let columns = this.state.columns;
        for (let i = 0; i < columns.length; i++) {
            totalWidth = totalWidth + parseInt(columns[i].width.toString())
        }
        return (
            <JqxGrid ref={this.myGrid}
                     source={this.state.source}
                     adaptive={true} width={totalWidth} //height={"100%"} //this.state.height
                     columns={this.state.columns} autoheight={true}
                     theme={this.state.theme} sortable={true} altrows={true} //pageable={true}
                     groupable={true} enabletooltips={true} //groups={this.state.groups}
                     selectionmode={'singlerow'} autoshowfiltericon={true}
                     filterable={true} showfilterrow={true}
                     showtoolbar={true} rendertoolbar={this.state.rendertoolbar}
            />
        );
    }
}

export default InfoJqxGridCmp;