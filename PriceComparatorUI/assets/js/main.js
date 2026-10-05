import { getExchangeRate } from "./services/currencyChange.js";
import { searchProducts } from "./services/productService.js";
import { spellCheck } from "./services/textValidator.js";
import { renderLoading } from "./ui/loading.js";
import { renderEmptyState } from "./ui/renderEmptyState.js";
import { renderProducts } from "./ui/renderProducts.js";


const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const popularTags = document.querySelectorAll(".popular-tag");
const currencySelect = document.getElementById("currencySelect");
const resultsGrid = document.getElementById("resultsGrid");
const resultsHeader = document.getElementById("resultsHeader");
const resultsTitle = document.getElementById("resultsTitle");
const resultCount = document.getElementById("resultCount");
const resultsNotice = document.getElementById("resultsNotice");

let currentProducts = [];
let currentCurrency = "USD";
let activeSearch = null;
let searchNumber = 0;


function setSearching(isSearching) {
    searchBtn.disabled = isSearching;
    searchBtn.textContent = isSearching ? "Searching…" : "Search";
    resultsGrid.setAttribute("aria-busy", String(isSearching));
}


function hideResultsMeta() {
    resultsHeader.hidden = true;
    resultsNotice.hidden = true;
    resultsNotice.textContent = "";
}


function showResultsMeta(query, products, providers) {
    resultsTitle.textContent = `Results for “${query}”`;
    resultCount.textContent = `${products.length} ${products.length === 1 ? "listing" : "listings"}`;
    resultsHeader.hidden = false;

    const unavailable = providers.filter((provider) => provider.available === false);
    if (unavailable.length > 0) {
        const names = unavailable.map((provider) => provider.name).join(" and ");
        resultsNotice.textContent = `${names} ${unavailable.length === 1 ? "is" : "are"} currently unavailable. Showing the results we could retrieve.`;
        resultsNotice.hidden = false;
    } else {
        resultsNotice.hidden = true;
        resultsNotice.textContent = "";
    }
}


async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    searchInput.value = searchTerm;

    if (searchTerm.length < 2) {
        searchInput.setAttribute("aria-invalid", "true");
        hideResultsMeta();
        renderEmptyState(
            "Enter at least 2 characters",
            "Try a product name such as “wireless headphones”.",
            "error",
        );
        searchInput.focus();
        return;
    }

    searchInput.removeAttribute("aria-invalid");
    activeSearch?.abort();
    activeSearch = new AbortController();
    const searchController = activeSearch;
    const thisSearch = ++searchNumber;
    const requestTimeout = window.setTimeout(() => searchController.abort(), 15000);

    hideResultsMeta();
    renderLoading();
    setSearching(true);

    try {
        const correctedTerm = await spellCheck(searchTerm);
        if (thisSearch !== searchNumber) {
            return;
        }

        if (correctedTerm !== searchTerm) {
            searchInput.value = correctedTerm;
        }

        const { products, providers } = await searchProducts(correctedTerm, searchController.signal);
        if (thisSearch !== searchNumber) {
            return;
        }

        currentProducts = products
            .filter((product) => Number.isFinite(Number(product.price)) && Number(product.price) > 0)
            .sort((first, second) => Number(first.price) - Number(second.price));
        currentCurrency = "USD";
        currencySelect.value = "USD";

        if (currentProducts.length > 0) {
            showResultsMeta(correctedTerm, currentProducts, providers);
            renderProducts(currentProducts);
            return;
        }

        const allUnavailable = providers.length > 0 && providers.every((provider) => !provider.available);
        hideResultsMeta();
        renderEmptyState(
            allUnavailable ? "Stores are unavailable" : "No matching products",
            allUnavailable
                ? "Check the backend configuration or try again in a moment."
                : "Try a broader product name or a different spelling.",
            allUnavailable ? "error" : "default",
        );
    } catch (error) {
        if (thisSearch !== searchNumber) {
            return;
        }

        currentProducts = [];
        hideResultsMeta();
        renderEmptyState(
            "We couldn’t complete that search",
            error.name === "AbortError"
                ? "The request took too long. Make sure the backend is running and try again."
                : error.message,
            "error",
        );
    } finally {
        window.clearTimeout(requestTimeout);
        if (thisSearch === searchNumber) {
            setSearching(false);
        }
    }
}


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearch();
});

popularTags.forEach((tag) => {
    tag.addEventListener("click", () => {
        searchInput.value = tag.textContent.trim();
        handleSearch();
    });
});

currencySelect.addEventListener("change", async () => {
    const requestedCurrency = currencySelect.value;
    if (currentProducts.length === 0 || requestedCurrency === currentCurrency) {
        currentCurrency = requestedCurrency;
        return;
    }

    currencySelect.disabled = true;
    try {
        const rate = await getExchangeRate("USD", requestedCurrency);
        currentCurrency = requestedCurrency;
        renderProducts(currentProducts, currentCurrency, rate);
    } catch {
        currencySelect.value = currentCurrency;
        resultsNotice.textContent = "Currency conversion is currently unavailable. Prices were not changed.";
        resultsNotice.hidden = false;
    } finally {
        currencySelect.disabled = false;
    }
});

renderEmptyState();
