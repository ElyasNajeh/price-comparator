import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from services import search_aliexpress_products, search_amazon_products


load_dotenv(Path(__file__).with_name(".env"))
UI_DIRECTORY = Path(__file__).resolve().parent.parent / "PriceComparatorUI"


def _allowed_origins() -> list[str]:
    configured = os.getenv(
        "ALLOWED_ORIGINS", "http://127.0.0.1:5500,http://localhost:5500"
    )
    return [origin.strip() for origin in configured.split(",") if origin.strip()]


app = FastAPI(title="Price Comparator API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type"],
)
app.mount("/assets", StaticFiles(directory=UI_DIRECTORY / "assets"), name="assets")


@app.get("/", include_in_schema=False)
def frontend() -> FileResponse:
    return FileResponse(UI_DIRECTORY / "index.html")


@app.get("/products")
def get_products(search: str = Query(min_length=2, max_length=100)) -> dict:
    query = search.strip()
    if len(query) < 2:
        raise HTTPException(status_code=422, detail="Search must contain at least 2 characters")

    providers = (
        (search_amazon_products, os.getenv("AMAZON_API_KEY")),
        (search_aliexpress_products, os.getenv("ALIEXPRESS_API_KEY")),
    )

    with ThreadPoolExecutor(max_workers=len(providers)) as executor:
        futures = [
            executor.submit(search_provider, query, key)
            for search_provider, key in providers
        ]
        results = [future.result() for future in futures]

    products = [product for result in results for product in result["products"]]
    provider_status = [
        {
            "name": result["provider"],
            "available": result["error"] is None,
            "count": len(result["products"]),
            "message": result["error"],
        }
        for result in results
    ]

    return {"query": query, "products": products, "providers": provider_status}
