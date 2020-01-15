import datetime
from django.db import models
# from django.contrib.postgres.fields import JSONField
from jsonfield_compat.fields import JSONField


class Activity_Log(models.Model):
    user_name = models.CharField(max_length=100)
    dept_name = models.CharField(max_length=100, null=True)
    app_label = models.CharField(max_length=100)
    view_name = models.CharField(max_length=100)
    view_des = models.CharField(max_length=600, null=True, blank=True)
    error_des = models.CharField(max_length=600, null=True, blank=True)
    access_date = models.DateField(blank=True, null=True)
    access_time = models.TimeField(blank=True, null=True)
    url = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    params_get = JSONField(null=True, blank=True)
    params_post = JSONField(null=True, blank=True)

    def insert_into_activity_log(self, request, app_label, view_name, view_des=None, url=None, completed=False):
        self.user_name = request.user.username
        self.dept_name = request.user.groups.name
        self.app_label = app_label
        self.view_name = view_name
        self.view_des = view_des
        self.url = url
        now = datetime.datetime.now()
        self.access_date = now.strftime("%Y-%m-%d")
        self.access_time = now.strftime("%H:%M:%S-%Z")
        self.completed = completed
        self.params_get = request.GET
        self.params_post = request.POST
        # act_log = Activity_Log(user_name=user_name,dept_name=dept_name, app_label=app_label, view_name=view_name, view_des=view_des,
        #                        url=url, completed=completed, params_get=params_get,params_post=params_post)
        # act_log.save()
        self.save()
        pass

    def update_error_desc(self, error_message):
        self.error_des = error_message
        self.save()

    def update_complete_status(self):
        self.completed = True
        self.save()