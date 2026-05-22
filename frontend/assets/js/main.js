import { renderProducts } from "./ui/renderProducts.js";

import { renderEmptyState } from "./ui/renderEmptyState.js";

import { renderLoading } from "./ui/loading.js";

// import { searchProductsEbay } from "./services/productService.js";

import { searchProducts } from "./services/productService.js";



const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const popularTags = document.querySelectorAll(".popular-tag");


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

        // const productsEbay =
        //     await searchProductsEbay(searchTerm);

        const products =
            await searchProducts(searchTerm);



        if (products.length > 0) {

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