const fallbackImage = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#eef2f7"/>
        <path d="M160 118h80v64h-80z" fill="#cbd5e1"/>
        <path d="m166 174 22-23 17 17 12-12 17 18" fill="none" stroke="#94a3b8" stroke-width="8"/>
        <circle cx="218" cy="135" r="8" fill="#94a3b8"/>
    </svg>
`)}`;


function safeImageUrl(value) {
    if (typeof value !== "string" || !value) {
        return fallbackImage;
    }

    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) ? url.href : fallbackImage;
    } catch {
        return fallbackImage;
    }
}


function formatPrice(amount, currency) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}


function formatRating(value) {
    if (value === null || value === undefined || value === "") {
        return "Not rated";
    }

    const rating = Number(value);
    return Number.isFinite(rating) && rating >= 0 ? `${rating.toFixed(1)} rating` : "Not rated";
}


export function renderProducts(products, currency = "USD", exchangeRate = 1) {
    const resultsGrid = document.getElementById("resultsGrid");
    const fragment = document.createDocumentFragment();
    resultsGrid.replaceChildren();

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "product-image-wrap";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = safeImageUrl(product.image);
        image.alt = "";
        image.loading = "lazy";
        image.addEventListener("error", () => {
            image.src = fallbackImage;
        }, { once: true });
        imageWrap.append(image);

        const store = document.createElement("span");
        store.className = "product-store";
        store.textContent = product.store || "Store";

        const title = document.createElement("h3");
        title.className = "product-title";
        title.textContent = product.title || "Untitled product";

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(Number(product.price) * exchangeRate, currency);

        const rating = document.createElement("p");
        rating.className = "product-rating";
        rating.textContent = `★ ${formatRating(product.rating)}`;

        card.append(imageWrap, store, title, price, rating);
        fragment.append(card);
    });

    resultsGrid.append(fragment);
}
