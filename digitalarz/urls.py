"""digitalarz URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

from digitalarz import settings
from digitalarz.admin import *
from .views import *

urlpatterns = \
    [
        path('', home_index, name="home"),
        path('test/', TemplateView.as_view(template_name='test.html')),
        path('sms_service/', sms_service, name="sms_service"),
        path('admin/', admin.site.urls),
        path('accounts/', include('django.contrib.auth.urls')),
        path('sa/', include('spatial_app.urls')),
        # path('teachers_admin/', teacher_admin_site.urls),
        # path('accounts/logout/', '' name="logout")
        # url(r'^', include('django.contrib.auth.urls')),
        # url(r'^reset-password/$', PasswordResetView.as_view(), name='password_reset'),
        # url(r'^reset-password/done/$', PasswordResetDoneView.as_view(), name='password_reset_done'),
        #
        # url(r'^reset-password/confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$', PasswordResetConfirmView.as_view(),
        #     name='password_reset_confirm'),
        #
        # url(r'^reset-password/complete/$', PasswordResetCompleteView.as_view(), name='password_reset_complete')
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
