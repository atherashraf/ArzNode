from django.apps import apps
from django.contrib import admin, messages
#
# # Register your models here.
from django.shortcuts import redirect
from django.template.response import TemplateResponse
from django.urls import path, reverse


from digitalarz.admin import spatial_management_admin
from digitalarz.utils import Log_Error
from spatial_app.layer.forms import ModelLayerForm, UploadShapeFileForm
from spatial_app.layer.models import LayerInfo, RasterInfo

# @spatial_management_admin.register(LayerInfo)
from spatial_app.layer.utils import upload_shapefile
from spatial_app.utils import Spatial_Utils


def view_layer(modeladmin, request, queryset):
    # queryset.update(status='p')
    obj = queryset.first()
    url = reverse('layer_view', args=[obj.layer_name])
    return redirect(url)


def view_layer_data(modeladmin, request, queryset):
    obj = queryset.first()
    url = reverse('layer_view', args=[obj.layer_name])
    return redirect(url)


view_layer.short_description = "View the selected layer"


class LayerInfoAdmin(admin.ModelAdmin):
    # list_display = [field.name for field in LayerInfo._meta.get_fields()]
    list_display = ['id', 'name', 'layer_name', 'table_name', 'layer_type', 'extent', 'srid', 'geom_type', 'style',
                    'app_label', 'model_name', 'file_path', 'icon', 'main_category', 'rst_overview_list', 'is_network',
                    'created_by', 'upload_at', 'created_at']
    search_fields = ['layer_name', 'model_name', 'table_name', 'main_category']
    list_filter = ['main_category']
    actions = [view_layer]
    save_on_top = True
    change_list_template = "admin/layer/layer_change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('addmodellayer/', self.add_model_layer, name='add_model_layer'),
            path('uploadshapefile/<str:model_name>', self.upload_shape_file, name='upload_shape_file'),
        ]
        return my_urls + urls
        return urls

    def add_model_layer(self, request):
        if request.method == 'POST':
            form = ModelLayerForm(request.POST)
            try:
                app_label = form.data['app_label']
                model_name = form.data['model_name']
                category = form.data['category']
                # print('App Label: %s, Model Name: %s' % (app_label, model_name))
                model = apps.get_model(app_label, model_name)
                is_spatial = Spatial_Utils.is_spatial_model(model)
                if is_spatial:
                    Spatial_Utils.add_model_layer_info(model, category, request.user.username)
                    # next = request.POST.get('next', '/')
                    #
                    # return HttpResponseRedirect(next)
                else:
                    message = "Model %s doesn't contain any spatial field" % model_name
                    messages.error(request, message)
            except Exception as e:
                Log_Error.log_view_error_message(request, e)

        model_layer_form = ModelLayerForm()
        context = dict(self.admin_site.each_context(request),
                       form=model_layer_form)
        return TemplateResponse(request, "admin/add_model_as_layer.html", context)

    def upload_shape_file(self, request, model_name):
        if request.method == "POST":
            form = UploadShapeFileForm(request.POST, request.FILES)
            if form.is_valid():
                files = request.FILES
                layer_info = LayerInfo.objects.filter(model_name=model_name.lower()).first()
                if layer_info is not None:
                    msg = upload_shapefile(files, layer_info.layer_name)
            else:
                msg = "Not able to find layer against model %s" % model_name
            # redirect_path = request.META.get('HTTP_REFERER', '')
            # if redirect_path == '':
            redirect_path = "/spatial_data_admin/wmp/" + model_name.lower()
            messages.add_message(request, messages.INFO, msg)
            return redirect(redirect_path)
        else:
            upload_shapefile_form = UploadShapeFileForm()
            context = dict(self.admin_site.each_context(request),
                           model_name=model_name,
                           form=upload_shapefile_form)
            return TemplateResponse(request, "admin/upload_shape_file.html", context)


spatial_management_admin.register(LayerInfo, admin_class=LayerInfoAdmin)

# class RasterInfoAdmin(SimpleHistoryAdmin):
#     list_display = [field.name for field in LayerInfo._meta.get_fields()]
#     search_fields = []
#     list_filter = []
#
#
# spatial_management_admin.register(RasterInfo)
