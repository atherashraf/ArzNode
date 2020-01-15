
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import connection
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from digitalarz.utils import Common_Utils, DB_Query, Log_Error
from spatial_app.layer.models import LayerInfo
import json

from spatial_app.layer.utils import upload_shapefile
from spatial_app.local_settings import MODEL_FIELD_TYPES


@login_required
def layer_list(request):
    layerInfo = list(LayerInfo.objects.all().values('name', 'layer_name', 'layer_type', 'main_category', 'extent', 'srid',
                                                    'created_at', 'upload_at'))

    return render(request, 'layer_list.html', {"layerInfo": json.dumps(layerInfo, default=Common_Utils.json_converter)})


@login_required
def layer_view(request, layer_name):
    info = LayerInfo.objects.filter(layer_name=layer_name).values('name', 'main_category', 'model_name', 'app_label').first()
    if info:
        return render(request, 'layer_view.html',
                      {"layerName": layer_name, "modelName": info['model_name'], "appLabel": info["app_label"],
                       "name": info['name'],
                       "category": info['main_category']})
    else:
        messages.add_message(request, messages.ERROR, 'Layer not found...')
        return redirect(reverse('layer_list'))


@login_required
def layer_download(request, layer_name):
    layer_name = 'bdtehsil1572126210426'
    layer_info = LayerInfo.objects.filter(layer_name=layer_name).first()
    table_name = layer_info.table_name
    query = "Select * from %s" % table_name

    pass


@csrf_exempt
def layer_upload(request, layer_name):
    print(layer_name);
    file_name = None  # 'upload/wmp/Weatherstations.shp'
    files = request.FILES
    msg = upload_shapefile(files,layer_name)
    messages.add_message(request, msg)
    return HttpResponse(msg)
