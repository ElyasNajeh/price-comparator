export function renderProducts(products) {

    const resultsGrid = document.getElementById("resultsGrid");


    resultsGrid.innerHTML = products.map(product => `

        <div class="card">

            <img
                src="${product.image}"
                alt="${product.title}"
                class="product-image"
                onerror="
                this.src='https://placehold.co/300x300?text=No+Image'
                 "
            >

            <span class="product-store">

                ${product.store}

            </span>

            <h3 class="product-title">

                ${product.title}

            </h3>

            <div class="product-price">

                $${product.price}

            </div>

            <div class="product-rating">

                ⭐ ${product.rating}

            </div>
        </div>

    `).join("");
}