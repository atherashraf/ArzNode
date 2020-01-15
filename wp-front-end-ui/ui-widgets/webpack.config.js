const path = require('path');
const webpack = require('webpack');

const widget = {
    "base": {name: "base", ext: ".js", html: "base.pug"},
    "index": {name: "index", ext: ".js", html: "index.pug", widgetList: ["base", "index"]},
    "signinPage": {name: "signin", ext: ".js", html: "signin-page.pug", widgetList: ["base", "signinPage"]},
    "layerList": {name: "layer-list", ext: ".js", html: "layer-list.pug", widgetList: ["base", "layerList"]},
    "layerView": {name: "layer-view", ext: ".js", html: "layer-view.pug", widgetList: ["base", "layerView", "olMap"]},
    "olMap": {name: "ol-map", ext: ".js"},
    "pivotTable": {name: "pivot-table", ext: ".js"},
    "cesium": {name: "cesium", ext:".js", html:"cesium.html", widgetList:["cesium"]}
}

module.exports = (env, options) => {
    // const file_name_prefix = organisms[2];
    const list = ["index", "signinPage", "layerList", "layerView"];
    const key = list[5];
    console.log("working on..." + key);
    let entry = {};
    let widgetList = widget[key].widgetList;
    for (let val in widgetList)
        entry[widgetList[val]] = './src/molecules/' + widget[widgetList[val]].name + "-widget" + widget[widgetList[val]].ext;
    let config = null;
    if (env.NODE_ENV === 'start') {
        const startConfig = require("./webpack-start-script.config");
        config = startConfig(options, entry, widget[key].html, false);
    } else {
        const buildConfig = require("./webpack-build-script.config");
        const app_name = "ui_components";
        config = buildConfig(options, entry, app_name, false)
    }
    return config;
}