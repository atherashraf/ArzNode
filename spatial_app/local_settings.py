LAYER_TYPE_CHOICES = [('Vector', 'Vector'), ('Raster', 'Raster')]
GEOM_TYPE_CHOICES = [('Point', 'Point'), ('Polyline', 'Polyline'), ('Polygon', 'Polygon')]
CATEGORY_CHOICES = [('History', 'History'), ('Avalanche', 'Avalanche'), ('Boundary', 'Boundary'),
                    ('Demography', 'Demography'), ('Weather', 'Weather'),('Infrastructure', 'Infrastructure')]
SPATIAL_EXTENT_4326 = (60.5000000000624, 23.4999999998205, 79.5000000003122, 37.5000000001664)
SPATIAL_EXTENT_3857 = (6734829.193000, 2692598.219300, 8849899.518100, 4509031.393100)
DEFAULT_PROJECTION = 4326


MODEL_FIELD_TYPES = {
    "spatial": ['GeometryField', 'PointField', 'LineStringField', 'PolygonField',
                'MultiPointField', 'MultiLineStringField', 'MultiPolygonField',
                'GeometryCollectionField', 'RasterField'],
    "number": ['AutoField', 'BigAutoField', 'BigIntegerField', 'DecimalField', 'DurationField', 'FloatField',
               'IntegerField', 'PositiveIntegerField', 'PositiveSmallIntegerField', 'SmallIntegerField'],
    "date": ['DateField', 'DateTimeField', 'TimeField'],
    "string": ['CharField', 'EmailField', 'FilePathField', 'TextField'],
    "others": ['BinaryField', 'BooleanField', 'FileField', 'FileField and FieldFile',
               'ImageField', 'GenericIPAddressField', 'NullBooleanField', 'SlugField', 'URLField', 'UUIDField']
}
