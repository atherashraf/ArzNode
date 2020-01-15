from django.urls import path
from .views import *

urlpatterns = [
    # path('add_model', add_model, name='add_model')
    path('layer_list/', layer_list, name='layer_list'),
    path('layer_view/<str:layer_name>/', layer_view, name='layer_view'),
    path('layer_upload/<str:layer_name>/', layer_upload, name= 'layer_upload'),
    path('layer_download/<str:layer_name>/', layer_download, name='layer_download'),
]
