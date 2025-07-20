from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://perwez4568:IB82zJIBx97TK9Jn@cluster0.vd9axud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DATABASE_NAME = "hro_ecommerce"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
product_collection = db["products"]
order_collection = db["orders"]

# Helper to convert ObjectId to str
def serialize_mongo_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc
