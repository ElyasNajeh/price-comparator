import logging
import re
from typing import Any

import requests


LOGGER = logging.getLogger(__name__)
REQUEST_TIMEOUT = 8
MAX_PRODUCTS_PER_PROVIDER = 20


def _price_as_number(value: Any) -> float | None:
    """Extract a positive numeric price from provider-specific values."""
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return round(float(value), 2) if value > 0 else None

    if not isinstance(value, str):
        return None

    match = re.search(r"\d[\d,]*(?:\.\d+)?", value)
    if not match:
        return None

    try:
        price = float(match.group(0).replace(",", ""))
    except ValueError:
        return None

    return round(price, 2) if price > 0 else None


def _provider_error(provider: str, message: str) -> dict[str, Any]:
    return {"provider": provider, "products": [], "error": message}


def _get_json(
    provider: str,
    url: str,
    api_key: str | None,
    host: str,
    params: dict[str, str],
) -> dict[str, Any]:
    if not api_key:
        raise RuntimeError(f"{provider} is not configured")

    response = requests.get(
        url,
        headers={"x-rapidapi-key": api_key, "x-rapidapi-host": host},
        params=params,
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    payload = response.json()

    if not isinstance(payload, dict):
        raise ValueError("The provider returned an unexpected response")

    return payload


def search_amazon_products(search_value: str, api_key: str | None) -> dict[str, Any]:
    provider = "Amazon"

    try:
        payload = _get_json(
            provider,
            "https://real-time-amazon-data.p.rapidapi.com/search",
            api_key,
            "real-time-amazon-data.p.rapidapi.com",
            {
                "query": search_value,
                "page": "1",
                "country": "US",
                "sort_by": "RELEVANCE",
                "product_condition": "ALL",
                "is_prime": "false",
                "deals_and_discounts": "NONE",
            },
        )

        data = payload.get("data")
        if not isinstance(data, dict):
            raise ValueError("The provider returned an unexpected response")

        raw_products = data.get("products", [])
        if not isinstance(raw_products, list):
            raise ValueError("The provider returned an unexpected response")

        products = []
        for item in raw_products[:MAX_PRODUCTS_PER_PROVIDER]:
            if not isinstance(item, dict):
                continue

            title = item.get("product_title")
            price = _price_as_number(item.get("product_price"))
            if not isinstance(title, str) or not title.strip() or price is None:
                continue

            products.append(
                {
                    "title": title.strip(),
                    "image": item.get("product_photo") or "",
                    "price": price,
                    "currency": "USD",
                    "rating": item.get("product_star_rating"),
                    "store": provider,
                }
            )

        return {"provider": provider, "products": products, "error": None}
    except RuntimeError as exc:
        return _provider_error(provider, str(exc))
    except (requests.RequestException, AttributeError, KeyError, ValueError, TypeError) as exc:
        LOGGER.warning("%s product search failed: %s", provider, exc)
        return _provider_error(provider, f"{provider} is temporarily unavailable")


def search_aliexpress_products(
    search_value: str, api_key: str | None
) -> dict[str, Any]:
    provider = "AliExpress"

    try:
        payload = _get_json(
            provider,
            "https://aliexpress-datahub.p.rapidapi.com/item_search_2",
            api_key,
            "aliexpress-datahub.p.rapidapi.com",
            {"q": search_value, "page": "1", "sort": "default", "currency": "USD"},
        )

        result_data = payload.get("result")
        if not isinstance(result_data, dict):
            raise ValueError("The provider returned an unexpected response")

        raw_products = result_data.get("resultList", [])
        if not isinstance(raw_products, list):
            raise ValueError("The provider returned an unexpected response")

        products = []
        for result in raw_products[:MAX_PRODUCTS_PER_PROVIDER]:
            item = result.get("item", {}) if isinstance(result, dict) else {}
            sku = item.get("sku", {}) if isinstance(item, dict) else {}
            default_sku = sku.get("def", {}) if isinstance(sku, dict) else {}
            title = item.get("title") if isinstance(item, dict) else None
            price = _price_as_number(
                default_sku.get("promotionPrice") or default_sku.get("price")
            )

            if not isinstance(title, str) or not title.strip() or price is None:
                continue

            image = item.get("image") or ""
            if isinstance(image, str) and image.startswith("//"):
                image = f"https:{image}"

            products.append(
                {
                    "title": title.strip(),
                    "image": image,
                    "price": price,
                    "currency": "USD",
                    "rating": item.get("averageStarRate"),
                    "store": provider,
                }
            )

        return {"provider": provider, "products": products, "error": None}
    except RuntimeError as exc:
        return _provider_error(provider, str(exc))
    except (requests.RequestException, AttributeError, KeyError, ValueError, TypeError) as exc:
        LOGGER.warning("%s product search failed: %s", provider, exc)
        return _provider_error(provider, f"{provider} is temporarily unavailable")
