from django.urls import path
from .views import *

urlpatterns = [
    path('jqx/grid_layer_data/<str:layer_name>/', get_jqx_grid_layer_data, name='jqx_grid_layer_data'),
    path('jqx/grid_table_data/<str:table_name>/', get_jqx_grid_table_data, name='jqx_grid_table_data'),
]
