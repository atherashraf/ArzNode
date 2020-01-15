# from django.db import models
from django.contrib.gis.db import models
from django.contrib.postgres.fields import JSONField, ArrayField
from simple_history.models import HistoricalRecords

from spatial_app.local_settings import LAYER_TYPE_CHOICES, GEOM_TYPE_CHOICES, CATEGORY_CHOICES


# class IntegrationDatabaseconnections(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(unique=True, max_length=500)
#     title = models.CharField(max_length=100, blank=True, null=True)
#     con_string = models.TextField()  # This field type is a guess.
#     created_at = models.DateField()
#     created_by = models.CharField(max_length=100, blank=True, null=True)
#     integrated_data = models.TextField(blank=True, null=True)  # This field type is a guess.
#
#     class Meta:
#         managed = True


class LayerInfo(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    layer_name = models.CharField(max_length=200, blank=True, null=True)
    table_name = models.CharField(max_length=200)
    layer_type = models.CharField(max_length=100, blank=True, null=True, choices=LAYER_TYPE_CHOICES)
    geom_type = models.CharField(max_length=30, blank=True, null=True, choices=GEOM_TYPE_CHOICES)
    extent = ArrayField(models.FloatField(), blank=True, null=True)
    srid = models.IntegerField(blank=True, null=True)
    # orig_extent = ArrayField(blank=True, null=True)
    # orig_srid = models.IntegerField(blank=True, null=True)
    style = JSONField(blank=True, null=True)
    app_label = models.CharField(max_length=100, blank=True, null=True)
    model_name = models.CharField(max_length=500, blank=True, null=True)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    icon = models.CharField(max_length=500, blank=True, null=True)
    main_category = models.CharField(max_length=500, blank=True, null=True, choices=CATEGORY_CHOICES)
    rst_overview_list = models.CharField(max_length=100, blank=True, null=True)
    is_network = models.BooleanField(default=False)
    created_by = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    upload_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    # label = models.TextField(blank=True, null=True)  # This field type is a guess.
    # remote_conn_name = models.ForeignKey('IntegrationDatabaseconnections', models.DO_NOTHING, blank=True, null=True)
    history = HistoricalRecords()

    class Meta:
        managed = True


class RasterInfo(models.Model):
    id = models.AutoField(primary_key=True)
    table_name = models.CharField(max_length=200)
    main_table_name = models.CharField(max_length=200)
    res_x = models.DecimalField(max_digits=20, decimal_places=6)
    res_y = models.DecimalField(max_digits=20, decimal_places=6)
    num_bands = models.IntegerField(blank=True, null=True)
    pixel_type = models.CharField(max_length=30, blank=True, null=True)
    info_id = models.ForeignKey('LayerInfo', models.DO_NOTHING)  # Field name made lowercase.

    class Meta:
        managed = True


class PunjabDistrict(models.Model):
    oid = models.AutoField(primary_key=True)
    iso = models.CharField(db_column='ISO', max_length=3, blank=True, null=True)  # Field name made lowercase.
    name_0 = models.CharField(db_column='NAME_0', max_length=75, blank=True, null=True)  # Field name made lowercase.
    name_1 = models.CharField(db_column='NAME_1', max_length=75, blank=True, null=True)  # Field name made lowercase.
    name_2 = models.CharField(db_column='NAME_2', max_length=75, blank=True, null=True)  # Field name made lowercase.
    name_3 = models.CharField(db_column='NAME_3', max_length=75, blank=True, null=True)  # Field name made lowercase.
    varname_3 = models.CharField(db_column='VARNAME_3', max_length=100, blank=True,
                                 null=True)  # Field name made lowercase.
    nl_name_3 = models.CharField(db_column='NL_NAME_3', max_length=75, blank=True,
                                 null=True)  # Field name made lowercase.
    hasc_3 = models.CharField(db_column='HASC_3', max_length=25, blank=True, null=True)  # Field name made lowercase.
    type_3 = models.CharField(db_column='TYPE_3', max_length=50, blank=True, null=True)  # Field name made lowercase.
    engtype_3 = models.CharField(db_column='ENGTYPE_3', max_length=50, blank=True,
                                 null=True)  # Field name made lowercase.
    validfr_3 = models.CharField(db_column='VALIDFR_3', max_length=25, blank=True,
                                 null=True)  # Field name made lowercase.
    validto_3 = models.CharField(db_column='VALIDTO_3', max_length=25, blank=True,
                                 null=True)  # Field name made lowercase.
    remarks_3 = models.CharField(db_column='REMARKS_3', max_length=50, blank=True,
                                 null=True)  # Field name made lowercase.
    shape_leng = models.FloatField(db_column='Shape_Leng', blank=True, null=True)  # Field name made lowercase.
    shape_area = models.FloatField(db_column='Shape_Area', blank=True, null=True)  # Field name made lowercase.
    pop = models.IntegerField(blank=True, null=True)
    geom = models.GeometryField(srid=3857, blank=True, null=True)

    class Meta:
        managed = False
        app_label = 'spatial_ds'
        db_table = 'gis_punjab_district_20180211062053527757'
