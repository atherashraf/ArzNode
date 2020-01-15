from django.db import models

# Create your models here.
class MapInfo(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)
    title = models.CharField(max_length=600)
    params = models.TextField()  # This field type is a guess.
    created_by = models.CharField(max_length=200)
    created_at = models.DateField(blank=True, null=True)
    created_time = models.TimeField(blank=True, null=True)
    icon = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = True