import * as React from "react";
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

// see documentation for supported input formats
class PivotTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props
    }

    setData(data) {
        this.setState({
            data: data
        })
    }

    render() {
        return (
            <PivotTableUI
                data={this.state.data}
                onChange={s => this.setState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...this.state}
            />
        );
    }
}

export default PivotTable