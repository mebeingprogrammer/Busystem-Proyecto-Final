from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import json
app = Flask(__name__)
app.config["MONGO_URI"]='mongodb://localhost:27017/busystem'
mongo = PyMongo(app)

#collections
CORS(app)
db = mongo.db.users #demo
db_buses = mongo.db.buses
db_routes = mongo.db.routes
db_schedules = mongo.db.schedules
db_reservations = mongo.db.reservations

#/BUSES
@app.route('/buses',methods=["GET","POST"])
def getpost_buses():
    #GET PROCESS
    if request.method =="GET":
        o = []
        for i in db_buses.find():
            o.append({"_ID":str(ObjectId(i["_id"])),"busNumber":i["busNumber"],"model":i["model"],"capacity":i["capacity"],"year":i["year"],"status":i["status"]})
        return jsonify(o)
    #POST PROCESS
    elif request.method == "POST":
        id = db_buses.insert_one({"busNumber":request.json["busNumber"],"model":request.json["model"],"capacity":request.json["capacity"],"year":request.json["year"],"status":request.json["status"]})
        return jsonify({"inserted_id": str(id.inserted_id)})

@app.route('/buses/<id>', methods=["DELETE","PUT"])
def deleteput_buses(id):
    #DELETE PROCESS
    if request.method == "DELETE":
        db_buses.delete_one({"_id":ObjectId(id)})
        return jsonify({"message":"deleted!"})
    #PUT PROCESS
    elif request.method == "PUT":
        db_buses.update_one({"_id":ObjectId(id)},{"$set":{
            "busNumber":request.json["busNumber"],
            "model":request.json["model"],
            "capacity":request.json["capacity"],
            "year":request.json["year"],
            "status":request.json["status"]
        }})
        return jsonify({"message":"updated!"})
    
    #/ROUTES
@app.route('/routes',methods=["GET","POST"])
def getpost_routes():
    #GET PROCESS
    if request.method =="GET":
        o = []
        for i in db_routes.find():
            o.append({"_ID":str(ObjectId(i["_id"])),"routeName":i["routeName"],"origin":i["origin"],"destination":i["destination"],"distance":i["distance"]})
        return jsonify(o)
    #POST PROCESS
    elif request.method == "POST":
        id = db_routes.insert_one({"routeName":request.json["routeName"],"origin":request.json["origin"],"destination":request.json["destination"],"distance":request.json["distance"]})
        return jsonify({"inserted_id": str(id.inserted_id)})

@app.route('/routes/<id>', methods=["DELETE","PUT"])
def deleteput_routes(id):
    #DELETE PROCESS
    if request.method == "DELETE":
        db_routes.delete_one({"_id":ObjectId(id)})
        return jsonify({"message":"deleted!"})
    #PUT PROCESS
    elif request.method == "PUT":
        db_routes.update_one({"_id":ObjectId(id)},{"$set":{
            "routeName":request.json["routeName"],
            "origin":request.json["origin"],
            "destination":request.json["destination"],
            "distance":request.json["distance"],
        }})
        return jsonify({"message":"updated!"})
    
#/SCHEDULES
@app.route('/schedules',methods=["GET","POST"])
def getpost_schedules():
    #GET PROCESS
    if request.method =="GET":
        o = []
        for i in db_schedules.find():
            o.append({"_ID":str(ObjectId(i["_id"])),"busId":i["busId"],"routeId":i["routeId"],"departureTime":i["departureTime"],"arrivalTime":i["arrivalTime"]})
        return jsonify(o)
    #POST PROCESS
    elif request.method == "POST":
        id = db_schedules.insert_one({"busId":request.json["busId"],"routeId":request.json["routeId"],"departureTime":request.json["departureTime"],"arrivalTime":request.json["arrivalTime"]})
        return jsonify({"inserted_id": str(id.inserted_id)})

@app.route('/schedules/<id>', methods=["DELETE","PUT"])
def deleteput_schedules(id):
    #DELETE PROCESS
    if request.method == "DELETE":
        db_schedules.delete_one({"_id":ObjectId(id)})
        return jsonify({"message":"deleted!"})
    #PUT PROCESS
    elif request.method == "PUT":
        db_schedules.update_one({"_id":ObjectId(id)},{"$set":{
            "busId":request.json["busId"],
            "routeId":request.json["routeId"],
            "departureTime":request.json["departureTime"],
            "arrivalTime":request.json["arrivalTime"],
        }})
        return jsonify({"message":"updated!"})
    


#/RESERVATIONS
@app.route('/reservations', methods=["GET", "POST"])
def getpost_reservations():
    if request.method == "GET":
        o = []
        for i in db_reservations.find():
            o.append({
                "_ID": str(i["_id"]),
                "scheduleId": str(i["scheduleId"]),
                "passengerName": i["passengerName"],
                "passengerEmail": i["passengerEmail"]
            })
        return jsonify(o)

    elif request.method == "POST":
        reservation_data = {
            "scheduleId": ObjectId(request.json["scheduleId"]),
            "passengerName": request.json["passengerName"],
            "passengerEmail": request.json["passengerEmail"]
        }
        id = db_reservations.insert_one(reservation_data)
        return jsonify({"inserted_id": str(id.inserted_id)})

@app.route('/reservations/<id>', methods=["DELETE", "PUT"])
def deleteput_reservations(id):
    if request.method == "DELETE":
        db_reservations.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "deleted!"})

    elif request.method == "PUT":
        updated_data = {
            "scheduleId": ObjectId(request.json["scheduleId"]),
            "passengerName": request.json["passengerName"],
            "passengerEmail": request.json["passengerEmail"]
        }
        db_reservations.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
        return jsonify({"message": "updated!"})