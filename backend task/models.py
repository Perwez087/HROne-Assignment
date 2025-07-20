from pydantic import BaseModel, Field
from typing import Optional, List


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    size: str

class ProductResponse(ProductCreate):
    id: str = Field(alias="_id")


class OrderItem(BaseModel):
    product_id: str
    quantity: int

class OrderCreate(BaseModel):
    user_id: str
    items: List[OrderItem]

class OrderResponse(OrderCreate):
    id: str = Field(alias="_id")
