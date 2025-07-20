from fastapi import FastAPI, Query, Path
from fastapi.responses import JSONResponse
from typing import Optional, List
from bson import ObjectId, Regex
from database import product_collection, order_collection, serialize_mongo_doc
from models import ProductCreate, ProductResponse, OrderCreate, OrderResponse

app = FastAPI(title="HROne Backend Task")

@app.get("/")
def root():
    return {"message": "Welcome! Go to /docs for API documentation."}


@app.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(product: ProductCreate):
    product_dict = product.dict()
    result = await product_collection.insert_one(product_dict)
    created_product = await product_collection.find_one({"_id": result.inserted_id})
    return serialize_mongo_doc(created_product)


@app.get("/products", response_model=List[ProductResponse])
async def list_products(
    name: Optional[str] = Query(None),
    size: Optional[str] = Query(None),
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0)
):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"} 
    if size:
        query["size"] = size

    cursor = product_collection.find(query).skip(offset).limit(limit)
    products = await cursor.to_list(length=limit)
    return [serialize_mongo_doc(p) for p in products]

@app.post("/orders", response_model=OrderResponse, status_code=201)
async def create_order(order: OrderCreate):
    order_dict = order.dict()
    result = await order_collection.insert_one(order_dict)
    created_order = await order_collection.find_one({"_id": result.inserted_id})
    return serialize_mongo_doc(created_order)

@app.get("/orders/{user_id}", response_model=List[OrderResponse])
async def get_user_orders(
    user_id: str = Path(...),
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0)
):
    query = {"user_id": user_id}
    cursor = order_collection.find(query).skip(offset).limit(limit)
    orders = await cursor.to_list(length=limit)
    return [serialize_mongo_doc(o) for o in orders]
