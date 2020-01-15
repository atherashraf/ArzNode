# from digitalarz.utils import DB_Query
# from spatial_app.layer.models import RasterInfo
#
#
class Raster2Map():
    layer_name = None
    empty_raster = None
    width = None
    height = None
    map_envelop = None
    layer_envelop = None
    pixel_size = None
    map_srid = None
    layer_srid = None
    rast_info = None
    union_raster = None
    final_raster = None
    num_bands = None
    pass
#     def __init__(self, *args, **kwargs):
#         self.layer_name = args[0]['layer_name']
#         self.width = args[0]['width']
#         self.height = args[0]['height']
#         self.map_envelop = args[0]['map_envelop']
#         self.pixel_size = args[0]['pixel_size']
#         self.map_srid = args[0]['map_srid']
#         self.layer_srid = args[0]['layer_srid']
#         self.table_name = args[0]['table_name']
#         self.app_label = args[0]['app_label']
#         self.create_layer_envelop()
#         self.layer_styling = Layer_Styling(self.layer_name)
#         self.result_table = args[0]['result_table']
#
#     def create_image(self):
#         if self.final_raster is not None:
#             content = self.convert_raster_to_png(self.final_raster, 'tiled_raster.png')
#         else:
#             color_map = '0:0:0:0:0\n' \
#                         'nv:0:0:0:0'
#             content = self.convert_raster_to_png(self.empty_raster, 'final_union_raster.png', color_map)
#         return content
#
#     def create_empty_raster(self):
#         bbox = self.map_envelop.extent
#         rast_info_list = \
#             list(RasterInfo.objects.filter(res_x__lte=self.pixel_size, main_table_name=self.layer_name).order_by(
#                 '-res_x'))
#
#         if len(rast_info_list) > 0:
#             self.rast_info = rast_info_list[0]
#         else:
#             rast_info_list = RasterInfo.objects.filter(table_name=self.layer_name)
#             if rast_info_list.count() > 0:
#                 self.rast_info = rast_info_list[0]
#             else:
#                 self.rast_info = RasterInfo
#                 pixeltype_query = 'Select Distinct(ST_BandPixelType(rast)) from %s where layer_name=\'%s\'' % (
#                     self.result_table, self.layer_name)
#                 self.rast_info.pixel_type = DB_Query.execute_query_as_one(pixeltype_query)
#                 query = 'SELECT max(st_numbands(rast)) As num_bands, max(ST_PixelWidth(st_transform(rast, 3857))) As pixwidth, max(ST_PixelHeight(st_transform(rast, 3857))) As pixheight ' \
#                         'from "%s" where layer_name=\'%s\'' % (self.result_table, self.layer_name)
#
#                 self.rast_info.num_bands = DB_Query.execute_query_as_one(query)
#                 self.rast_info.table_name = self.result_table
#         self.num_bands = self.rast_info.num_bands
#         bands = ""
#         for i in range(0, self.num_bands):
#             bands = bands + "ROW(%s, '%s'::text, 0, NULL)," % (str(i + 1), self.rast_info.pixel_type)
#         bands = bands[:len(bands) - 1]
#         query = "SELECT st_setSRID(ST_AddBand(ST_MakeEmptyRaster(%s,%s,%s,%s,%s),ARRAY[%s]::addbandarg[])" \
#                 ",%s) as rast" % (self.width, self.height, bbox[0], bbox[3], self.pixel_size, bands, self.map_srid)
#         self.empty_raster = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#
#     def create_layer_envelop(self):
#         self.layer_envelop = transform_geometry(self.map_envelop, self.map_srid, self.layer_srid, response_asText=False)
#         # if self.map_srid != self.layer_srid:
#         #     self.layer_envelop = self.map_envelop.transform(self.layer_srid)
#         # else:
#         #     self.layer_envelop = self.map_envelop
#
#     def create_union_raster(self):
#         num_bands = self.rast_info.num_bands
#         if self.result_table is None:
#             intersect_query = "Select rast as rast from %s where st_intersects(envelope,'%s')" % (
#                 self.rast_info.table_name, self.layer_envelop)
#         else:
#             intersect_query = "Select rast as rast from %s where st_intersects(envelope,'%s') and layer_name='%s'" % (
#                 self.result_table, self.layer_envelop, self.layer_name)
#         # intersect_query = "Select rast as rast from %s" % (self.rast_info.table_name)
#         with_query = "With trans_rast as( " + intersect_query + \
#                      ") , retile_rast as(" \
#                      "	Select st_tile(rast,100,100, TRUE, 0) rast from trans_rast" \
#                      "), resample_rast as(" \
#                      "   Select st_resample(rast,(Select rast from retile_rast limit 1)) rast from retile_rast" \
#                      ")"
#
#         query = "%s Select st_union(rast) from resample_rast" % with_query
#         # query = "Select st_union(rast) from %s where st_intersects(envelope,'%s')" % (rast_info.table_name, eg_ext_geom)
#
#         self.union_raster = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#
#     def create_final_raster(self):
#         query = "select st_transform(CAST('%s' AS Raster),%s)" % (self.union_raster, self.map_srid)
#         transformed_raster = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#
#         query = "select st_resample(CAST('%s' AS Raster),CAST('%s' As Raster))" % (
#             transformed_raster, self.empty_raster)
#         resample_raster = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#
#         query = "with unionResult as(" \
#                 "SELECT  CAST('%s' AS Raster) as rast union SELECT CAST('%s' AS Raster) as rast" \
#                 ")" % (self.empty_raster, resample_raster)
#         # query = query + "\n SELECT st_union(unionResult.rast,ARRAY[ROW(1, 'SUM')]::unionarg[]) from unionResult"
#         band_op = ""
#         for i in range(0, self.rast_info.num_bands):
#             band_op = band_op + "ROW(%s, 'SUM')," % (str(i + 1))
#         band_op = band_op[:len(band_op) - 1]
#         query = query + "SELECT st_union(unionResult.rast, ARRAY[%s]::unionarg[]) from unionResult" % band_op
#
#         final_union_raster = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#
#         query = "select st_clip(CAST('%s' AS Raster),st_geomfromtext('%s',%s))" % (
#             final_union_raster, self.map_envelop.wkt, self.map_srid)
#         self.final_raster = DB_Query.execute_query_as_one(query)
#
#     def convert_raster_to_png(self, raster, image_name, color_map=None):
#         # query = "Select St_numbands(CAST('%s' AS Raster))" % (raster)
#         # num_band = DB_Query.execute_query_as_one(query)
#         if color_map is None:
#             if self.num_bands >= 3:
#                 stretch_raster = self.minmax_stretch(raster)
#                 query = "SELECT St_AsPng(CAST('%s' AS Raster),ARRAY[1,2,3])" % (stretch_raster)
#             else:
#                 color_map = self.create_color_map(self.layer_name)
#                 query = "SELECT ST_AsPNG(ST_ColorMap(CAST('%s' AS Raster),1, '%s'))" % (raster, color_map)
#         else:
#             query = "SELECT ST_AsPNG(ST_ColorMap(CAST('%s' AS Raster),1, '%s'))" % (raster, color_map)
#         final_image = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#         content = bytes(final_image)
#         # wirte_to_new_file("uploaded/" + image_name, content)
#         return content
#
#     def get_layer_stats(self, layer_name):
#         query = "With ss as (" \
#                 "SELECT rid, band, ST_SummaryStats(rast, band) As stats FROM %s CROSS JOIN generate_series(1,4) As band) " \
#                 "Select ss.band, sum((stats).\"count\"), sum((stats).\"sum\"),avg((stats).\"mean\"),avg((stats).\"stddev\"),min((stats).\"min\"),max((stats).\"max\") " \
#                 "from ss GROUP BY ss.band ORDER BY ss.band" % layer_name
#         stats = DB_Query.execute_query_as_dict(query, app_label=self.app_label)
#         return stats
#
#     def get_raster_stats(self, raster):
#         query = "With ss as (" \
#                 "SELECT rid, band, ST_SummaryStats(CAST('%s' as Raster), band) As stats FROM generate_series(1,4) As band) " \
#                 "Select ss.band, sum((stats).\"count\"), sum((stats).\"sum\"),avg((stats).\"mean\"),avg((stats).\"stddev\"),min((stats).\"min\"),max((stats).\"max\") " \
#                 "from ss GROUP BY ss.band ORDER BY ss.band" % raster
#         stats = DB_Query.execute_query_as_dict(query, app_label=self.app_label)
#         return stats
#
#     def apply_map_algebra_expr(self, raster, expr, band=1):
#         query = "WITH foo AS (Select st_band(CAST('%s' AS Raster),%s) rast) " \
#                 "SELECT ST_MapAlgebra(rast, '8BUI', '%s' ,0)FROM foo" % (raster, band, expr)
#         # query = "SELECT ST_MapAlgebra(CAST('%s' AS Raster) rast, band, NULL, '%s')" %(raster,expr)
#         rast = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#         return rast
#
#     def minmax_expr(self, min, max):
#         m = (254 - 25) / (max - min)
#         c = 254 - m * max
#         expr = 'ceil(%s * [rast.val] + %s)' % (m, c)
#         return expr
#
#     def minmax_stretch(self, raster):
#         stats = self.get_layer_stats(self.layer_name)
#         # bands_sub_query = []
#         # bands_color_map = []
#         bands = []
#         for i in range(3):
#             min_val = float(stats[i]['min'])
#             max_val = float(stats[i]['max'])
#
#             expr = self.minmax_expr(min_val, max_val)
#             # rast_band = execute_query_as_one("Select st_band(CAST('%s' AS Raster),%s)" %(raster,(i+1)))
#             stretch_band = self.apply_map_algebra_expr(raster, expr, (i + 1))
#             bands.append(stretch_band)
#
#
#             # sub_query = "Select ST_ColorMap(CAST('%s' AS Raster),%s, '%s')" %(raster,(i+1),'grayscale')
#             # bands.append(DB_Query.execute_query_as_one(sub_query))
#             # bands_sub_query.append(sub_query)
#         query = "Select st_addband(CAST('%s' AS RASTER), ARRAY[CAST('%s' AS RASTER),CAST('%s' AS RASTER)])" % (
#             bands[0], bands[1], bands[2])
#         strech_raster = DB_Query.execute_query_as_one(query, app_label=self.app_label)
#         return strech_raster
#
#     def create_color_map(self, layer_name):
#         # no_of_bands = self.num_bands
#         color_map = None
#         rules = []
#         layer_info_list = Info.objects.filter(layer_name=self.layer_name)
#         if layer_info_list.count() > 0:
#             layer_info = layer_info_list[0]
#             if layer_info.style is None:
#                 query = "SELECT rid, band, (stats).* " \
#                         "FROM (SELECT rid, band, ST_SummaryStats(rast, band) As stats " \
#                         "FROM %s CROSS JOIN generate_series(1,%s) As band WHERE rid=1) As foo" % (
#                             self.layer_name, self.num_bands)
#                 stats = DB_Query.execute_query_as_dict(query)
#                 style = self.layer_styling.get_default_raster_style(stats)
#                 rules = style['rules']
#             else:
#                 rules = layer_info.style['rules']
#         elif layer_name.endswith("_ssa_"):
#             # query = "SELECT rid, band, (stats).* " \
#             #         "FROM (SELECT rid, band, ST_SummaryStats(rast, band) As stats " \
#             #         "FROM %s CROSS JOIN generate_series(1,%s) As band WHERE layer_name = '%s') As foo" % (
#             #             self.result_table, self.num_bands, self.layer_name)
#             # stats = DB_Query.execute_query_as_dict(query)
#             # stats[0]['max'] = 1
#             # stats[0]['min'] = 0
#             # stats[0]['mean'] = 0.5
#             style = Layer_Styling.get_functional_layer_style('ssa')
#             rules = style['rules']
#         for rule in rules:
#             raster_symbolizer = rule['raster_symbolizer']
#             color_map_entries = raster_symbolizer["color_map"]
#             arr_color_map = []
#             color_map_entries = sorted(color_map_entries, key=itemgetter('quantity'), reverse=True)
#             for cm_ent in color_map_entries:
#                 # for i in range(len(color_map_entries)-1,0,-1):
#                 #     cm_ent = color_map_entries[i]
#                 color_hex = cm_ent["color"]
#                 rgb = tuple(int(color_hex[i:i + 2], 16) for i in (1, 3, 5))
#                 op = float(cm_ent["opacity"]) * 255
#                 value = cm_ent["quantity"]
#                 arr_color_map.append("%s  %s  %s   %s   %s" % (value, rgb[0], rgb[1], rgb[2], op))
#             arr_color_map.append("0  0    0    0   0")
#             arr_color_map.append("nv 0    0    0   0")
#             color_map = "\n".join(arr_color_map)
#         return color_map
#
#     def create_tile_GDALRaster(self, layer_name, map_envelope, pixel_size, width, height, map_srid, layer_srid):
#         layer_envelope = transform_geometry(map_envelope, map_srid, des_srid=layer_srid, response_asText=False)
#         rast_info = Raster_Info.objects.filter(res_x__lte=pixel_size, main_table_name=layer_name).order_by('-res_x')[0]
#         query = "Select st_width(rast) width, st_height(rast) height, st_srid(rast) srid," \
#                 "  rast, st_astext(envelope) wkt from %s where st_intersects(envelope,'%s')" % (
#                     rast_info.table_name, layer_envelope)
#         rast_list = DB_Query.execute_query_as_dict(query, app_label=self.app_labely)
#
#         for rastObj in rast_list:
#             raster = GDALRaster({
#                 "srid": rastObj["srid"],
#                 "width": rastObj["width"],
#                 "height": rastObj["height"],
#                 "bands": [{"data": rastObj["rast"], "nodata_value": 0}]
#             });
#
#             # print("width:" + raster.width + " height:" + raster.height)
#             raster = RasterField(rastObj['rast'])
#         pass
