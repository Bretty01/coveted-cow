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
        page = 0,
        productsPerPage = 12,
        } = {}) {
        let query
        if(filters) {
            if("name" in filters) {
                query = { $text: { $search: filters["name"] } }
            } else if ("price" in filters) {
                query = { "price": parseFloat(filters["price"]) }
            } else if ("sku" in filters) {
                query = {"product_description.sku": parseInt(filters["sku"])}
            }
        }
        let cursor

        try {
            cursor = await productInfo.find(query)
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
}