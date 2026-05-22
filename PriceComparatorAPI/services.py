import requests


def search_amazon_products(search_value, api_key):
    try:
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
        }

        response = requests.get(url, headers=headers, params=querystring, timeout=5)
        return response.json()
    except Exception as e:
        return {"status": "error", "message": str(e)}


def search_Express_products(search_value, api_key):
    try:
        url = "https://aliexpress-datahub.p.rapidapi.com/item_search_2"

        querystring = {"q": search_value, "page": "1", "sort": "default"}

        headers = {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com",
        }

        response = requests.get(url, headers=headers, params=querystring, timeout=5)
        return response.json()
    except Exception as e:
        return {"status": "error", "message": str(e)}
