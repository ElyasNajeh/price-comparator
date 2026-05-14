import { renderProducts } from "./ui/renderProducts.js";

import { renderEmptyState } from "./ui/renderEmptyState.js";

import { renderLoading } from "./ui/loading.js";

import { searchProducts } from "./services/productService.js";


const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");


renderEmptyState();


// SEARCH FUNCTION
async function handleSearch() {

    const searchTerm = searchInput.value.trim();


    if (!searchTerm) return;


    renderLoading();


    try {

        const products = await searchProducts(searchTerm);


        if (products.length > 0) {

            renderProducts(products);

        } else {

            renderEmptyState();
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