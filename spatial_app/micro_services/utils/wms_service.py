import PIL
from io import BytesIO

from spatial_app.micro_services.utils.raster2map import Raster2Map


class WMS_Service():
    def create_empty_raster(self):
        width = int(self.width)
        height = int(self.height)
        img = PIL.Image.new('RGBA', (width, height), color=(0, 0, 0, 110))
        # img_draw = ImageDraw.Draw(img)
        # fill_color = (255, 0,0, 125)
        # img_draw.polygon([(0,0),(0, height),(width, height),(width,0)],fill_color)
        content = BytesIO()
        format_split = self.format.split("/")
        img_format = "png"
        if len(format_split) > 0:
            img_format = format_split[1]
        img.save(content, img_format, optimize=True)
        return content.getvalue()

    def get_map_service(self, request):
        content = None
        self.styles = None
        self.project_id = request.GET.get('project_id') if 'project_id' in request.GET else request.GET.get(
            'project_id'.upper())
        self.result_table = request.GET.get('RESULT_TABLE') if 'RESULT_TABLE' in request.GET else None
        self.bbox = request.GET.get('bbox') if 'bbox' in request.GET else request.GET.get('bbox'.upper())
        self.styles = request.GET.get('styles') if 'styles' in request.GET else request.GET.get('styles'.upper())
        self.width = request.GET.get('width') if 'width' in request.GET else request.GET.get('width'.upper())
        self.height = request.GET.get('height') if 'height' in request.GET else request.GET.get('height'.upper())
        # map_srs = request.GET.get('srs'.upper())
        self.map_srs = request.GET.get('srs') if 'srs' in request.GET else request.GET.get('CRS')
        self.layer_name = request.GET.get('layers') if 'layers' in request.GET else request.GET.get('layers'.upper())
        self.format = request.GET.get('format') if 'format' in request.GET else request.GET.get('format'.upper())
        self.format_option = request.GET.get('format_options') if 'format_option' in request.GET else request.GET.get(
            'format_option'.upper())
        # self.style = request.GET.get('styles'.upper())

    def create_raster_tile_image(self, layer_name, pixel_size, width, height, map_envelop, map_srid, layer_srid, bbox,
                                 table_name, app_label, result_table):
        r2map = Raster2Map(
            {"layer_name": layer_name, "width": width, "height": height, "map_envelop": map_envelop,
             "pixel_size": pixel_size, "map_srid": map_srid,
             "layer_srid": layer_srid, "table_name": table_name, "app_label": app_label, "result_table": result_table})

        r2map.create_empty_raster()
        r2map.create_union_raster()
        if not r2map.union_raster is None:
            r2map.create_final_raster()
        content = r2map.create_image()
        return content