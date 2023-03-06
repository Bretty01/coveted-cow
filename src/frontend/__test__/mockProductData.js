export const mockProductData = {
    data: {
        products: [
            {
                _id: "93fndinaDN9W39m",
                name: "CowCow",
                price: 99.99,
                image: "CowCow.jpg",
                product_description: {
                    release_date: "October 1984",
                    sku: 86753090,
                    brand: "Mock Brand",
                    details: "This is a mock brand. Heck, it's even more fake than the already fake website that this " +
                        "currently is. Really nice to fluff this out a little bit though. Hi, how is your day today. I am " +
                        "doing fantastic. Really feeling motivated to push myself again and again.",
                    specs: {
                        height: 1,
                        width: 2,
                        depth: 3,
                        weight: 4
                    },
                    reviews: [
                        {
                            rating: 4,
                            date: "2020-01-01T04:00:00.000+00:00",
                            title: "Very Real!",
                            description: "I expected this mock to be fake, but damn this is a real as it gets. Thanks " +
                                "Mr.Developer!",
                        }
                    ],
                    reviewCount: 1,
                    reviewScore: 5
                }
            }
        ]
    }
}

export const mockBrandData = { data : {
    brandList : [
        "Brand",
        "Mockular",
        "Fuzzfest",
        "ABC123",
        "Imaginalabratory"
    ]
}
}