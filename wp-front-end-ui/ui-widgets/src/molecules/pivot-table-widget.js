import * as ReactDOM from "react-dom";
import * as React from "react";
import PivotTable from "../atoms/ui-utils/pivot-table";
import PivotTableStoreModel from "../store/pivot-table-store-model";
import {Provider} from "react-redux";

// const data = [['attribute', 'attribute2'], ['value1', 'value2']];
// export const ptStoreModel = new PivotTableStoreModel();
const pivotTableRef = React.createRef();
const pivotTable = <PivotTable ref={pivotTableRef} data={[]}/>
ReactDOM.render(pivotTable, document.getElementById("pivot-table-container"))

export default pivotTableRef;