import * as React from 'react';
import connect from "react-redux/lib/connect/connect";
import {withStyles, withTheme} from '@material-ui/core/styles';
import {styles} from "../../molecules/static/styles/materialui-styles";
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";


class LayerListView extends React.Component {
    tableStyle = {
        table: {
            tableLayout: "fixed",
            width: "100%",
            border: "1px dashed"
        },
        tr: {
            // borderBottom: "1px solid black"
        },
        th: {
            textAlign: "left",
            // color: "darkolivegreen",
            width: "30%",
            fontSize: "0.8rem"
        },
        td: {
            textAlign: "left",
            wordWrap: "break-word",
            fontSize: "0.8rem"
        }
    }

    constructor(props) {
        super(props)
        this.viewLayerURL = this.props.uri + "/sa/layer/layer_view/";
        this.downloadLayerURL = this.props.uri + "/sa/layer/layer_download/";
    }

    getInfoTableRows(info) {

        const {theme} = this.props;
        let trs = [];
        let i = 0;
        for (let key in info) {
            if (i !== 0) {
                trs.push(
                    <tr style={this.tableStyle.tr} key={"key-info-row-" + i}>
                        <th style={this.tableStyle.th} color="secondary">{key.replace("_", " ")}</th>
                        <td style={this.tableStyle.td}>{info[key]}</td>
                    </tr>
                )
            }
            i++;
        }
        return trs;
    }

    layerCard(info, key) {
        let imagePath = "/static/components/img/noimage.jpg"
        if (info.icon) imagePath = info.icon
        let card =
            <Grid key={key} container justify="center" alignItems="center"
                  style={{backgroundColor: "white", border: "1px black solid", padding: "10px"}}>
                <Grid item md={4}>
                    <img width={"95%"} max-height={"95%"} src={imagePath}/>
                </Grid>
                <Grid item md={8}>
                    <Typography gutterBottom variant="h5" component="h2">
                        <span className="text-color"> {info.name}</span>
                    </Typography>
                    <table style={this.tableStyle.table}>
                        <tbody>{this.getInfoTableRows(info)}</tbody>
                    </table>
                    <div className={"da-card"}>
                        <a href={this.viewLayerURL + info.layer_name}>View Layer</a>
                        <a href={this.downloadLayerURL + info.layer_name}>Download Layer</a>
                    </div>
                </Grid>
            </Grid>

        return card;
    }


    getLayerCards() {
        let {layerInfos} = this.props;
        let cards = [];
        for (let i in layerInfos) {
            let info = layerInfos[i];
            let key = "layerCard-" + i;
            // infos.push(this.layerCard(info, key));
            cards.push(
                this.layerCard(info, key)
            )
        }
        return cards;
    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <Container maxWidth="md" className={classes.container}>
                    {this.getLayerCards()}
                </Container>
            </React.Fragment>

        )
    }
}


const mapState2Props = (state) => {
    return state;
};

// export default connect(mapState2Props)(LayerListView);
export default connect(mapState2Props)(withStyles(styles)(LayerListView));