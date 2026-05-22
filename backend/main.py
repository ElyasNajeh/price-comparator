from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from services import (
    search_amazon_products,
    search_Express_products,
    search_eBay_products,
)
import os

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

amazon_key = os.getenv("AMAZON_API_KEY")
AliExpress_key = os.getenv("ALIEXPRESS_API_KEY")


@app.get("/products")
def get_prodcuts(search: str):
    amazon_prodcuts = search_amazon_products(search, amazon_key)
    aliExpress_products = search_Express_products(search, AliExpress_key)
    eBay_products = search_eBay_products(search)

    return {
        "amazon": amazon_prodcuts,
        "AliExpress": aliExpress_products,
        "eBay": eBay_products,
    }
