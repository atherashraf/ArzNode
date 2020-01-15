from django.urls import path, include

urlpatterns = [
    path('ol-map/', include('spatial_app.map.urls')),
    path('layer/', include('spatial_app.layer.urls')),
    path('gis/', include('spatial_app.micro_services.urls')),
]
