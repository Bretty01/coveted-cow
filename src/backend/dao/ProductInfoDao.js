import mongodb from "mongodb"
import UserDao from "./UserDao.js"
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
                        /**
                         * Example full string:
                         * {"$and":[{"$or":[{"product_description.brand":{"$eq":"Aurora"}},
                         * {"product_description.brand":{"$eq":"Exceptional Home"}}]},
                         * {"$or":[{"price":{"$gte":10,"$lte":100}}]}]}
                         */

                    }
                }
                else {
                    query = {"product_description.sku": parseInt(filters["sku"])}
                }
            }

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
            let withReviews = []
            for(let i = 0; i < productList.length; i++) {
                withReviews[i] = await this.appendReviewAggregate(productList[i])
            }
            return { withReviews, totalNumProducts }
        } catch (err) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${err}`)
            return { productList: [], totalNumProducts: 0 }
        }
    }

    static async getProductByID(id) {
        let productRes
        try {
            const pipeline = [
                {
                    $match: { _id: new ObjectId(id), },
                },
                //TODO: When reviews are added to the database, add code to retrieve the reviews to the database
            ]
            productRes = await productInfo.aggregate(pipeline).next()
            return await this.appendReviewAggregate(productRes)
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

    static async appendNewReview(productId, reviewTitle, reviewScore, reviewDescription, userId) {
        let updateRes
        try {
            updateRes = await productInfo.updateOne({_id: new ObjectId(productId)},
                {
                    $push: {
                        reviews:{
                            rating: reviewScore,
                            date: Date.now(),
                            title: reviewTitle,
                            description: reviewDescription,
                            user: new ObjectId(userId)
                        }
                    }
                })
        } catch(e) {
            console.error(e)
            return {status: 500, message: "Something went wrong submitting review: " + e}
        }
        return updateRes.modifiedCount === 1 ?  {status: 200, message: "Review successfully submitted."} :
             {status: 500, message: "Something went wrong upon submitting review."}
    }

    static async appendReviewAggregate(queryRes) {
        let totalScore = 0
        if(!queryRes.reviews || queryRes.reviews.length <= 0) {
            queryRes.reviewCount = 0
            queryRes.reviewScore = totalScore
            return queryRes
        }
        queryRes.reviewCount = queryRes.reviews.length
        for(let i = 0; i < queryRes.reviews.length; i++){
            totalScore = totalScore + queryRes.reviews[i].rating
            queryRes.reviews[i].user = await UserDao.getUserById(queryRes.reviews[i].user)
            delete queryRes.reviews[i].user.password
            delete queryRes.reviews[i].user._deleted
            delete queryRes.reviews[i].user._id
        }
        queryRes.reviewScore = (Math.round((totalScore / queryRes.reviews.length) * 10) / 10)
        return queryRes
    }
}