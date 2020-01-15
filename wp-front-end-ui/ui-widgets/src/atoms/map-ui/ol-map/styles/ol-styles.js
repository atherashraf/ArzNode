import CircleStyle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";

let image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({color: 'red', width: 1})
});

const olStyles = (geomType) => {
    let styles = {
        'Point': new Style({
            image: image
        }),
        'LineString': new Style({
            stroke: new Stroke({
                color: 'green',
                width: 1
            })
        }),
        'MultiLineString': new Style({
            stroke: new Stroke({
                color: 'green',
                width: 1
            })
        }),
        'MultiPoint': new Style({
            image: image
        }),
        'MultiPolygon': new Style({
            stroke: new Stroke({
                color: 'yellow',
                width: 1
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 0, 0.1)'
            })
        }),
        'Polygon': new Style({
            stroke: new Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        }),
        'GeometryCollection': new Style({
            stroke: new Stroke({
                color: 'magenta',
                width: 2
            }),
            fill: new Fill({
                color: 'magenta'
            }),
            image: new CircleStyle({
                radius: 10,
                fill: null,
                stroke: new Stroke({
                    color: 'magenta'
                })
            })
        }),
        'Circle': new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.2)'
            })
        })
    };
    return styles[geomType];
};

export default olStyles;