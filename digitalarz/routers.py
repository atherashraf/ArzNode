from digitalarz.localsettings import *
from digitalarz.utils import DB_Query


class multi_database_router(object):
    def db_for_read(self, model, **hints):
        connection_name = DB_Query.get_connection_key(model._meta.app_label, model._meta.model_name)
        return connection_name

    def db_for_write(self, model, **hints):
        connection_name = DB_Query.get_connection_key(model._meta.app_label, model._meta.model_name)
        return connection_name

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # print("%s, %s, %s") %(db,app_label,model_name)
        ALL_DB_APP = [] #['auth']
        ALL_DB_MODELS = ['contenttype']
        if app_label in ALL_DB_APP or model_name in ALL_DB_MODELS:
            return True

        req_db = DB_Query.get_connection_key(app_label, model_name)
        if db == req_db:
            return True

        return False
        # return None
