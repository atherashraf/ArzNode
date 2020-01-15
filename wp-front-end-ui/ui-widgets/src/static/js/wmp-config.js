
config.jqxWMPDataURL = '/akah/wmp/jqx/wmp_data';
config.jqxGridDataURL = '/ui_cmps/jqx/grid_layer_data/';
config.initLayers=[];
config.olMapVM = null;
config.mainLayerName = 'weather_station1576568319164';
let initLayerInfo = {}
initLayerInfo.name = "Tehsil";
initLayerInfo.layerName = "bdtehsil1572126210426";
initLayerInfo.modelName = "bdtehsil";
initLayerInfo.appLabel= "snow_avalanche"
initLayerInfo.category = "Boundary";
config.initLayers.push(initLayerInfo);

initLayerInfo = {}
initLayerInfo.name = "Weather Stations";
initLayerInfo.layerName = "weather_station1576568319164";
initLayerInfo.appLabel= "wmp"
initLayerInfo.modelName = "weather_station";
initLayerInfo.category = "Weather";
config.initLayers.push(initLayerInfo)