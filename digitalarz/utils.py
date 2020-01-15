import json
import logging
import sys
import traceback

from django.apps import apps
from django.contrib import messages
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.models import User
from django.contrib.sites import requests
from django.utils.safestring import mark_safe

from digitalarz.localsettings import *
from digitalarz.settings import EMAIL_HOST_USER


class Common_Utils():
    @classmethod
    def shorten_url(url):
        post_url = 'https://www.googleapis.com/urlshortener/v1/url?key={}'.format(
            'AIzaSyDBKox6Urc8SUwws9mXT9zJFaDbQlN0FL8')
        payload = {'longUrl': url}
        headers = {'content-type': 'application/json'}
        r = requests.post(post_url, data=json.dumps(payload), headers=headers)
        url_dict = r.json()
        return url_dict['id']

    @classmethod
    def createAuthUser(cls, request, username, email, is_staff=False):
        try:
            rand_pass = "testpucit"  # get_random_string()
            auth_user_obj = User.objects.filter(username=username, email=email).first()
            if auth_user_obj is None:
                auth_user_obj = User.objects.create_user(username=username, email=email, password=rand_pass,
                                                         is_staff=is_staff)
            else:
                messages.add_message(request, messages.INFO, mark_safe("%s  auth user already exist " % username))
            # auth_user_obj.set_password(rand_pass)
            reset_password = True
            reset_form = PasswordResetForm({'email': email})
            assert reset_form.is_valid()
            if request:
                reset_form.save(
                    request=request,
                    use_https=request.is_secure(),
                    subject_template_name='registration/password_reset_subject.txt',
                    email_template_name='registration/password_reset_email.html',
                )
            else:
                reset_form.save(from_email=EMAIL_HOST_USER)
        except Exception as e:
            Log_Error.log_view_error_message(request, e)
        return auth_user_obj

    @classmethod
    def get_memory_size(cls, obj, seen=None):
        """Recursively finds size of objects"""
        size = sys.getsizeof(obj)
        if seen is None:
            seen = set()
        obj_id = id(obj)
        if obj_id in seen:
            return 0
        # Important mark as seen *before* entering recursion to gracefully handle
        # self-referential objects
        seen.add(obj_id)
        if isinstance(obj, dict):
            size += sum([cls.get_memory_size(v, seen) for v in obj.values()])
            size += sum([cls.get_memory_size(k, seen) for k in obj.keys()])
        elif hasattr(obj, '__dict__'):
            size += cls.get_memory_size(obj.__dict__, seen)
        elif hasattr(obj, '__iter__') and not isinstance(obj, (str, bytes, bytearray)):
            size += sum([cls.get_memory_size(i, seen) for i in obj])
        return size

class Log_Error():
    @classmethod
    def log_view_error_message(cls, request, e, act_log=None, redirect_path=None):

        error_message = str(e)
        cls.log_error_message(e, act_log)
        if request:
            messages.add_message(request, messages.ERROR, error_message)
            if redirect_path is None:
                redirect_path = request.META.get('HTTP_REFERER', '')
                if redirect_path == '':
                    redirect_path = "/"
            return redirect_path

        # response.write(error_message)

    @classmethod
    def log_error_message(cls, e, act_log=None):
        error_message = str(e)
        logger = logging.getLogger()
        if act_log is not None: act_log.update_error_desc(error_message)
        logger.error(traceback.format_exc())
        return error_message

    @classmethod
    def log_message(cls, msg):
        logger = logging.getLogger()
        logger.error(msg)


class DB_Query(object):
    @classmethod
    def get_connection_key(cls, app_label, model_name=None, table_name=None):
        for key in CONNECTION_KEY_TESTS:
            if app_label in CONNECTION_KEY_TESTS[key]['APPS']:
                return CONNECTION_KEY_TESTS[key]['DB_KEY']
        return 'default'


class Model_Utils():
    @classmethod
    def get_model_filter_result_dict(cls, app_label, model_name, field_value, field_name='id'):
        model = apps.get_model(app_label=app_label, model_name=model_name)
        res = list(model.objects.filter(**{field_name: field_value}).values())
        return res
