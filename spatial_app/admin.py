from django.apps import apps
from django.contrib import admin

from digitalarz.admin import spatial_management_admin


class ListAdminMixin(object):
    def __init__(self, model, admin_site):
        self.list_display = [field.name for field in model._meta.fields]
        super(ListAdminMixin, self).__init__(model, admin_site)


# app_label_list = ['layer', 'ol-map']
# for app_label in app_label_list:
#     # models = apps.get_models()
#     models = apps.get_app_config(app_label).get_models()
#     for model in models:
#         admin_class = type('AdminClass', (ListAdminMixin, admin.ModelAdmin), {})
#         try:
#             spatial_management_admin.register(model, admin_class)
#         except admin.sites.AlreadyRegistered:
#             pass
