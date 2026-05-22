import requests
import base64
from dotenv import load_dotenv
import os

load_dotenv()

EBAY_ACCESS_TOKEN = None
EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")


def search_amazon_products(search_value, api_key):
    url = "https://real-time-amazon-data.p.rapidapi.com/search"

    querystring = {
        "query": search_value,
        "page": "1",
        "country": "US",
        "sort_by": "RELEVANCE",
        "product_condition": "ALL",
        "is_prime": "false",
        "deals_and_discounts": "NONE",
    }

    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers, params=querystring)
    return response.json()


def search_Express_products(search_value, api_key):
    url = "https://aliexpress-datahub.p.rapidapi.com/item_search_2"

    querystring = {"q": search_value, "page": "1", "sort": "default"}

    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com",
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers, params=querystring)

    return response.json()


def get_Token(clientID, clientSECRET):

    global EBAY_ACCESS_TOKEN

    credentials = f"{clientID}:{clientSECRET}"

    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {encoded_credentials}",
    }

    data = {
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope",
    }

    response = requests.post(
        "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
        headers=headers,
        data=data,
    )

    response_data = response.json()

    token = response_data["access_token"]

    EBAY_ACCESS_TOKEN = token

    return token


def search_eBay_products(search: str):

    global EBAY_ACCESS_TOKEN

    if not EBAY_ACCESS_TOKEN:
        get_Token(EBAY_CLIENT_ID, EBAY_CLIENT_SECRET)

    headers = {"Authorization": f"Bearer {EBAY_ACCESS_TOKEN}"}

    params = {"q": search, "limit": 20}

    response = requests.get(
        "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search",
        headers=headers,
        params=params,
    )

    # token expired
    if response.status_code == 401:

        get_Token(EBAY_CLIENT_ID, EBAY_CLIENT_SECRET)

        headers = {"Authorization": f"Bearer {EBAY_ACCESS_TOKEN}"}

        response = requests.get(
            "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search",
            headers=headers,
            params=params,
        )

    data = response.json()

    products = []

    for item in data.get("itemSummaries", []):

        products.append(
            {
                "title": item.get("title"),
                "price": item.get("price", {}).get("value"),
                "currency": item.get("price", {}).get("currency"),
                "image": item.get("image", {}).get("imageUrl"),
                "url": item.get("itemWebUrl"),
            }
        )

    return products
