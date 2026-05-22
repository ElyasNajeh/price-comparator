import { renderProducts } from "./ui/renderProducts.js";

import { renderEmptyState } from "./ui/renderEmptyState.js";

import { renderLoading } from "./ui/loading.js";

import { searchProductsEbay } from "./services/productService.js";

import { searchProducts } from "./services/productService.js";

import { convert } from "./services/currencyChange.js";

import { spellCheck } from "./services/textValidator.js";


const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const popularTags = document.querySelectorAll(".popular-tag");

const currencySelect = document.getElementById("currencySelect");

let currentCurrency = "USD";


popularTags.forEach(tag => {

    tag.addEventListener("click", () => {

        const productName = tag.textContent.trim();

        searchInput.value = productName;

        handleSearch();

    });

});

renderEmptyState("Start Searching");


// SEARCH FUNCTION
async function handleSearch() {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        renderEmptyState("No Results Found, Please Try Again");
        return;
    }

    renderLoading();

    try {
        const correctedTerm = await spellCheck(searchTerm);
        const products = await searchProductsEbay(correctedTerm);

        if (products.length > 0) {
            currencySelect.value = "USD";
            currentCurrency = "USD";
            renderProducts(products);
        } else {
            renderEmptyState("No Results Found, Please Try Again");
        }

    } catch (error) {
        console.log(error);
        renderEmptyState();
    }
}

// CLICK EVENT
searchBtn.addEventListener("click", handleSearch);


// ENTER EVENT
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        handleSearch();
    }
});

currencySelect.addEventListener("change", () => {
    const newCurrency = currencySelect.value;

    document.querySelectorAll(".product-price").forEach(el => {
        const price = parseFloat(el.textContent.replace(/[^0-9.]/g, ""));
        convert(currentCurrency, newCurrency, price, (converted) => {
            el.textContent = `${converted} ${newCurrency}`;
        });
    });

    currentCurrency = newCurrency;
});