from django.contrib.gis.gdal import DataSource
from django.contrib.gis.geos import GEOSGeometry
from django.apps import apps
from django.db.models import Max

from digitalarz.utils import Common_Utils, Log_Error
from spatial_app.layer.models import LayerInfo
from spatial_app.local_settings import MODEL_FIELD_TYPES


def upload_shapefile(files,layer_name):
    msg = "Failed to upload layer..."
    try:
        for key in files:
            fn = Common_Utils.handle_uploaded_file(files[key])
            if fn.split(".")[1] == 'shp': file_name = fn
        layer_info = LayerInfo.objects.filter(layer_name=layer_name).first()
        if file_name and layer_info:
            ds = DataSource(file_name)
            layer = ds[0]
            print(layer.fields)
            lyr_geoms = layer.get_geoms()
            model = apps.get_model(layer_info.app_label, layer_info.model_name)
            fields = model._meta.fields
            error_msgs = {}
            try:
                for i in range(len(lyr_geoms)):
                    model_obj = model()
                    geom = GEOSGeometry(lyr_geoms[i].geos)
                    li_srid = layer_info.srid
                    if geom.srid != li_srid:
                        geom.transform(li_srid)
                    for field in fields:
                        try:
                            db_col = field.db_column if field.db_column is not None else field.attname
                            if field.get_internal_type() == "AutoField":
                                max_val_obj = model.objects.all().aggregate(Max(db_col))
                                max_val = int(max_val_obj[db_col+"__max"]) if max_val_obj[db_col+"__max"] is not None else 0
                                model_obj.__setattr__(db_col, max_val+1)
                            elif field.get_internal_type() in MODEL_FIELD_TYPES["spatial"]:
                                model_obj.__setattr__(db_col, geom)
                            else:
                                layer_field = find_layer_field_against_db_column(layer.fields, db_col)
                                if layer_field is not None:
                                    model_obj.__setattr__(db_col, layer.get_fields(layer_field)[i])
                        except Exception as e:
                            print(str(e))
                    model_obj.save()
            except Exception as e:
                error_msgs[str(model_obj)] = str(e)
                Log_Error.log_error_message(e)
            msg = "Layer uploaded with exceptions..."  if len(error_msgs) > 0 else "Layer upload successful..."
    except Exception as e:
        Log_Error.log_error_message(e)
        msg=str(e)
    return msg

def find_layer_field_against_db_column(layer_fields, db_col):
    for lyr_field in layer_fields:
        if len(db_col) >=10 and lyr_field.lower() in db_col.lower():
            return lyr_field
        elif db_col.lower() == lyr_field.lower():
            return lyr_field
