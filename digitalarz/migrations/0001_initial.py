# Generated by Django 2.2.5 on 2019-10-15 18:31

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Activity_Log',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=100)),
                ('dept_name', models.CharField(max_length=100, null=True)),
                ('app_label', models.CharField(max_length=100)),
                ('view_name', models.CharField(max_length=100)),
                ('view_des', models.CharField(blank=True, max_length=600, null=True)),
                ('error_des', models.CharField(blank=True, max_length=600, null=True)),
                ('access_date', models.DateField(blank=True, null=True)),
                ('access_time', models.TimeField(blank=True, null=True)),
                ('url', models.CharField(max_length=200)),
                ('completed', models.BooleanField(default=False)),
                ('params_get', jsonfield.fields.JSONField(blank=True, null=True)),
                ('params_post', jsonfield.fields.JSONField(blank=True, null=True)),
            ],
        ),
    ]
