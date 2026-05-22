export function searchProductsEbay(searchValue) {
    return fetch(`https://dummyjson.com/products/search?q=${searchValue}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed To Fetch Products")
            }
            return response.json()
        })
        .then(data => {
            const eBayProducts = data.products.map(product => ({
                title: product.title,
                image: product.thumbnail,
                price: product.price,
                rating: product.rating,
                store: "eBay"
            }));
            return eBayProducts
        })
        .catch(error => {

            console.log(error)

            return []
        })
}

export function searchProducts(searchValue) {

    return fetch(`http://127.0.0.1:8000/products?search=${searchValue}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed To Fetch Products")
            }

            return response.json()
        })

        .then(data => {

            const amazonProducts = data.Amazon?.data?.products?.map(product => ({


                title: product.product_title,

                image: product.product_photo,

                price: product.product_price,

                rating: product.product_star_rating || "No Rating",

                store: "Amazon"

            })) || []

            const aliexpressProducts =
                data.AliExpress?.result?.resultList?.map(product => ({

                    title: product.item?.title,

                    image: product.item?.image
                        ? `https:${product.item.image}`
                        : "",

                    price:
                        product.item?.sku?.def?.promotionPrice || "N/A",

                    rating:
                        product.item?.averageStarRate || "No Rating",

                    store: "AliExpress"

                })) || []

            return [
                ...amazonProducts,
                ...aliexpressProducts
            ]
        })

        .catch(error => {

            console.log(error)

            return []

        })
}