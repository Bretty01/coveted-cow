import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let productInfo

export default class ProductInfoDao {
    static async injectDB(connect) {
        if(productInfo) {
            return
        }
        try {
            productInfo = await connect.db("website").collection("product")
        } catch (err) {
            console.error(`Unable to establish a connection in ProductInfoDao: ${err}`, )
        }
    }

    static async getProducts({
        filters = null,
        sort = null,
        search = null,
        page = 0,
        productsPerPage = 12,
        } = {}) {
        let query
        let sortOrder
        let sortType


        if(filters || search) {
            query = {"$and": []}
            if(search) {
                let textSearch = { $text: { $search: search } }
                query.$and.push(textSearch)
            }
            if(filters) {
                if(!filters.hasOwnProperty("sku")) {
                    if (filters["brand"].length > 0) {
                        let or = {"$or": []}
                        for (const i in filters["brand"]) {
                            or.$or.push({
                                "product_description.brand": {
                                    $eq: filters["brand"][i]
                                }
                            })
                        }
                        query.$and.push(or)
                    }
                    if (filters["price"].length > 0) {
                        let or = {"$or": []}
                        for (const i in filters["price"]) {
                            or.$or.push({
                                price: {
                                    $gte: filters["price"][i].lowValue,
                                    $lte: filters["price"][i].highValue
                                }
                            })
                        }
                        query.$and.push(or)
                    }
                }
                else {
                    query = {"product_description.sku": parseInt(filters["sku"])}
                }
            }

            console.log(JSON.stringify(query))
        }

        if(sort) {
            sortOrder = parseInt(sort.order)
            sortType = sort.type
        }
        let cursor
        try {
            cursor = await productInfo.find(query).sort({[sortType]:sortOrder})
        } catch (err) {
            console.error(`Unable to issue find command, ${err}`)
            return { productList: [], totalNumProducts: 0 }
        }
        const displayCursor = cursor.limit(productsPerPage).skip(productsPerPage * page)

        try {
            const productList = await displayCursor.toArray()
            const totalNumProducts = await productInfo.countDocuments(query)

            return { productList, totalNumProducts }
        } catch (err) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${err}`)
            return { productList: [], totalNumProducts: 0 }
        }
    }

    static async getProductByID(id) {
        try {
            const pipeline = [
                {
                    $match: { _id: new ObjectId(id), },
                },
                //TODO: When reviews are added to the database, add code to retrieve the reviews to the database
            ]

            return productInfo.aggregate(pipeline).next()
        } catch(err) {
            console.error(`Unable to retrieve product information: ${err}`)
            throw err
        }
    }

    static async getUniqueBrands() {
        let brandList
        try {
            brandList = await productInfo.distinct("product_description.brand")
            return { brandList }
        } catch (err) {
            console.log(`Unable to perform query, ${err}`)
            return { brandList: [] }
        }
    }
}