import json
import geobuf
from django.apps import apps

from django.core.serializers import serialize
from django.http import HttpResponse

# Create your views here.
from digitalarz.models import Activity_Log
from digitalarz.utils import Log_Error, Common_Utils
from spatial_app.layer.models import PunjabDistrict, LayerInfo
from spatial_app.micro_services.utils.wms_service import WMS_Service


def wms_service(request):
    act_log = Activity_Log()
    response = HttpResponse()
    try:
        request_type = request.GET.get('request') if 'request' in request.GET else request.GET.get('request'.upper())
        format = request.GET.get('format') if 'format' in request.GET else request.GET.get('format'.upper())
        wms = WMS_Service()
        if request_type == 'GetMap' or request_type == 'GetTile':
            content = wms.get_map_service(request)
            if content is None:
                content = wms.create_empty_raster()
            return response(content, content_type=format)
    except Exception as e:
        # Log_Error.log_view_error_message(response, e, act_log)
        Log_Error.log_error_message(e, act_log)
        content = wms.create_empty_raster();
        return response(content, content_type=format)


def wfs_geojson_service(request,layer_name):
    res = {}
    # str_geojson = serialize('geojson', PunjabDistrict.objects.all(),
    #                         geometry_field='geom',
    #                         fields=('name_0', 'name_1', 'name_2', 'name_3', 'pop'))
    layer_info =LayerInfo.objects.filter(layer_name=layer_name).first()
    layer_model = apps.get_model(layer_info.app_label,layer_info.model_name)
    str_geojson = serialize('geojson', layer_model.objects.all())
    print('Size of serialized string:%s' % str(Common_Utils.get_memory_size(str_geojson)/1000))
    geojson = json.loads(str_geojson)
    print('Size of geojson:%s' % str(Common_Utils.get_memory_size(geojson)/1000))
    res = geobuf.encode(geojson)
    print('Size of geobuf encode:%s' % str(Common_Utils.get_memory_size(res)/1000))
    # res = geobuf.decode(res)
    return HttpResponse(res, content_type='application/octet-stream')
    # return HttpResponse(res)