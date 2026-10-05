function getApiBaseUrl() {
    if (window.location.port === "8000") {
        return window.location.origin;
    }

    const backendHost = window.location.hostname || "127.0.0.1";
    const backendProtocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${backendProtocol}//${backendHost}:8000`;
}


const API_BASE_URL = getApiBaseUrl();


export async function searchProducts(searchValue, signal) {
    const url = new URL("/products", API_BASE_URL);
    url.searchParams.set("search", searchValue);

    let response;
    try {
        response = await fetch(url, {
            headers: { Accept: "application/json" },
            signal,
        });
    } catch (error) {
        if (error.name === "AbortError") {
            throw error;
        }

        throw new Error(
            "The backend is offline. Start the Price Comparator API and try again.",
        );
    }

    if (!response.ok) {
        let message = "The product search could not be completed.";

        try {
            const error = await response.json();
            if (typeof error.detail === "string") {
                message = error.detail;
            }
        } catch {
            // Keep the user-friendly fallback when the API response is not JSON.
        }

        throw new Error(message);
    }

    const data = await response.json();
    return {
        products: Array.isArray(data.products) ? data.products : [],
        providers: Array.isArray(data.providers) ? data.providers : [],
    };
}
