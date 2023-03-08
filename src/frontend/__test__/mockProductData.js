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
                    }
                },
                reviews: [
                    {
                        rating: 4,
                        date: "2020-01-01T04:00:00.000+00:00",
                        title: "Very Real!",
                        description: "I expected this mock to be fake, but damn this is a real as it gets. Thanks " +
                            "Mr.Developer!",
                        user: {
                            name: "Banana Bread",
                            email: "bananaandbread@gmail.com"
                        }

                    }
                ],
                reviewCount: 1,
                reviewScore: 5
            },
            {
                _id: "3nL29Dm8L22oL",
                name: "FloofFloof",
                price: 69.99,
                image: "FloofFloof.jpg",
                product_description: {
                    release_date: "January 1996",
                    sku: 12345678,
                    brand: "Fuzzfest",
                    details: "Test detail alert! Test detail alert",
                    specs: {
                        height: 100,
                        width: 20,
                        depth: 50,
                        weight: 1000
                    }
                },
                reviews: [
                    {
                        rating: 1,
                        date: "2021-07-14T04:00:00.000+00:00",
                        title: "Fake Review!",
                        description: "This is a fake review.",
                        user : {
                            name: "Boo Bob",
                            email: "boobob@testemail.com"
                        }
                    },
                    {
                        rating: 2,
                        date: "2023-03-03T04:00:00.000+00:00",
                        title: "Slightly Less Fake Review!",
                        description: "This is a slightly less fake review.",
                        user : {
                            name: "Foo Fob",
                            email: "foofob@testemail.com"
                        }
                    }
                ],
                reviewCount: 2,
                reviewScore: 1.5
            },
            {product_description: {sku: 92453905}},
            {product_description: {sku: 34895034}},
            {product_description: {sku: 72000549}}

        ], "page": 0,
        "entries_per_page":10,
        "total_results":25
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