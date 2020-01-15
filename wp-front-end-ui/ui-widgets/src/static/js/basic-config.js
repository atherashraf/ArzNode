/**
 * Base Configuration Settings.
 **/
config = {};
config.uri = "http://localhost:8123";
config.accountsURL = '/da/'
config.logoPath = "/static/components/img/da-logo.png";
config.appDefaultColor = '#7c9884'
config.statusbarHeight = 25;
config.toolbarHeight = 65;

config.nextPage = null;
config.userInfo = {'user_name': 'akahsu', 'session_key': 'fv29nluvf7q0nc805zp9mowhm55qi7kq'};
config.csrf_token = "GmcLp0prFojqzqIbHo9DosFgapfPvxtpw9fejBEODs1Yv3NOOAemsFYKG8qVpa1d";

config.navItems = [{'name': 'Home', 'href': '/', 'icon': 'fa fa-home'}, {
    'name': 'Layers',
    'href': '/sa/layer/layer_list/',
    'icon': 'fa fa-list'
}, {'name': 'WMP', 'href': '/akah/wmp/', 'icon': 'fa fa-sun-o', 'color':"#f3f71196"},
    {'name': 'Snow Avalanche', 'href': '/akah/sa/', 'icon': 'fa fa-snowflake-o', 'color':"#ffffffaa"}];
config.userItems = [{'name': 'Manage', 'href': '/admin/', 'icon': 'fa fa-database'}, {
    'name': 'Manage Spatial Data',
    'href': '/spatial_data_admin/',
    'icon': 'fa fa-database'
}, {'name': 'Sign out', 'href': '/accounts/logout/', 'icon': 'fa fa-sign-out'}];

/**
 *
 * Layer configuration Setting...
 */
config.wfsURL = "/sa/gis/wfs/geojson/"; //+ config.layerName + "/";
config.wmsURL = "/sa/gis/wms/get_map/";
