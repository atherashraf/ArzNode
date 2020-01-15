from django.urls import path, include
from .views import *

urlpatterns=[
    path('wms/get_map/<str:layer_name>/', wms_service, name='wms_get_map'),
    path('wfs/geojson/<str:layer_name>/', wfs_geojson_service, name='wfs_geojson_service' )
]