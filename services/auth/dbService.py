from uuid import UUID
from bson.objectid import ObjectId
import os
import sys
from time import sleep

import pymongo

mongo_host="mongo-database"

mongo_pass = os.environ.get("MONGO_PASSWORD") or "root"
mongo_db  = os.environ.get("MONGO_DB") or "test"
#TODO: think of a better solution for production
def keepConnecting():
    conn = None
    while not conn :
        try :
            sleep(1)
            conn = pymongo.MongoClient(mongo_host,username="admin",password=mongo_pass , authSource="admin")
        except Exception :
            print("[Error] Unable to reach mongo !",file=sys.stderr)
    return conn["chatbot"]

conn = keepConnecting()

class DBService(object):
    """docstring for DBService."""
    def __init__(self):
        super(DBService, self).__init__()
        self.db = keepConnecting()

    def refreshConnection(self):
        print("[WARNING] refreshing connection",file=sys.stderr)
        self.db = keepConnecting()
        print("[INFO] connection refreshed",file=sys.stderr)

    def getApp(self, app_id):
        app = self.db.apps.find_one({"_id":ObjectId(app_id)})
        if(not app):
            return None
        return app

    def getAppTokens(self,middlewareId,app) :
        """ check if app is registred in our database and retrieves tokens """
        middleware = list(filter(lambda x: str(x['_id']) == middlewareId, app['middlewares']))
        if(middleware):
            return middleware[0]
        return None

    def getAppModels(self,app) :
        """retrieves models related to app"""
        models = {}
        for k in app["models"].keys():
            models[k] = app['models'][k]["container_name"]
        return models
