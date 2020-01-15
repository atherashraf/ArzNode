from django.urls import path
from .views import *
urlpatterns = [
    path('', sa_home_index, name="sa_home"),
]
