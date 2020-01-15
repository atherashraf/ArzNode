from django.apps import apps
from django.contrib.gis.db.models import Extent

from digitalarz.utils import Common_Utils
from spatial_app.layer.models import LayerInfo
from spatial_app.local_settings import MODEL_FIELD_TYPES


class Spatial_Utils:
    @classmethod
    def get_app_spatial_models(cls, app_label):
        app_models = apps.get_app_config(app_label).get_models()
        spatial_models = []
        for model in app_models:
            is_spatial = cls.is_spatial_model(model)
            if is_spatial and model._meta.model_name.find('historical') == -1:
                spatial_models.append(model)
        return spatial_models

    # @classmethod
    # def get_app_spatial_models_names(cls, app_label):
    #     model_names.append(model._meta.model_name)
    # return model_names

    @classmethod
    def is_spatial_model(cls, model):
        fields = model._meta.get_fields()
        # model._meta.get_fields('geom').get_internal_type()
        for field in fields:
            type = field.get_internal_type()
            if type in MODEL_FIELD_TYPES["spatial"]:
                return True
        return False

    @classmethod
    def get_model_spatial_field(cls, model):
        fields = model._meta.get_fields()
        # model._meta.get_fields('geom').get_internal_type()
        spatial_fields = []
        for field in fields:
            type = field.get_internal_type()
            if type in MODEL_FIELD_TYPES["spatial"]:
                spatial_fields.append(field)

        return spatial_fields

    @classmethod
    def add_model_layer_info(cls, model, category, user_name):
        # model = apps.get_model(app_label, model_name)
        spatial_fields = cls.get_model_spatial_field(model)
        for field in spatial_fields:
            layerInfo = LayerInfo()
            layerInfo.name = Common_Utils.create_name_from_string(model._meta.model_name)
            layerInfo.layer_name = model._meta.model_name + str(Common_Utils.get_time_in_miliseconds())
            layerInfo.layer_type = "Vector"
            layerInfo.extent = cls.get_model_extent(model, field.attname)
            layerInfo.srid = cls.get_model_geom_type(model, field.attname)
            layerInfo.main_category = category
            layerInfo.app_label = model._meta.app_label
            layerInfo.model_name = model._meta.model_name
            layerInfo.table_name = model._meta.db_table
            layerInfo.created_by = user_name
            layerInfo.save()

    @classmethod
    def get_model_geom_type(cls, model, attname):
        obj = model.objects.first()
        if obj:
            field_rec = getattr(obj, attname)
            return field_rec.srid if field_rec is not None else None
        return None
    @classmethod
    def get_model_extent(cls, model, field_name):
        try:
            qs = model.objects.all().aggregate(Extent(field_name))
            key = field_name + "__extent"
            return list(qs[key]) if qs[key] is not None else None
        except Exception as e:
            return None
