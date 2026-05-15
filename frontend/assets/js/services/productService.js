// export function searchProductsEbay(searchValue) {
//     return fetch(`https://dummyjson.com/products/search?q=${searchValue}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Failed To Fetch Products")
//             }
//             return response.json()
//         })
//         .then(data => {
//             const eBayProducts = data.products.map(product => ({
//                 title: product.title,
//                 image: product.thumbnail,
//                 price: product.price,
//                 rating: product.rating,
//                 store: "eBay"
//             }));
//             return eBayProducts
//         })
//         .catch(error => {

//             console.log(error)

//             return []
//         })
// }
export function searchProducts(searchValue) {

    return fetch(`http://127.0.0.1:8000/products?search=${searchValue}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed To Fetch Products")
            }

            return response.json()
        })

        .then(data => {

            const amazonProducts = data.amazon.data.products.map(product => ({

                title: product.product_title,

                image: product.product_photo,

                price: product.product_price,

                rating: product.product_star_rating,

                store: "Amazon"

            }))

            const aliexpressProducts =
                data.AliExpress?.result?.resultList?.map(product => ({

                    title: product.item.title,

                    image: "https:" + product.item.image,

                    price: product.item.sku.def.promotionPrice,

                    rating: product.item.averageStarRate,

                    store: "AliExpress"

                })) || []

            const eBayProducts = data.eBay.map(product => ({
                title: product.title,

                image: product.image,

                price: product.price,

                rating: "4.5",

                store: "eBay"
            }))
            return [
                ...amazonProducts,
                ...aliexpressProducts,
                ...eBayProducts
            ]
        })

        .catch(error => {

            console.log(error)

            return []

        })
}