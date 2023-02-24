import mongodb from "mongodb"
import UserDao from "./UserDao.js"
const ObjectId = mongodb.ObjectId
let productInfo

export default class ProductInfoDao {
    /**
     * Function: injectDB
     * Purpose: Initializes connection the to the "product" mongoDB collection
     */
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

    /**
     * Function: getProducts
     * Purpose: Creates a query string to send to the database and return a list of products based on the query.
     * @param filters The query filters for the products.
     * @param sort The sort type and the direction of the sort.
     * @param search The search string.
     * @param page Current page number.
     * @param productsPerPage The max amount of products to return
     * @returns Total amount of products returned and an array of the products.
     */
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

        //Builds an entire query string based on whether information was submitted or not.
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
                         * "$or":[{"price":{"$gte":10,"$lte":100}}]}]}
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
        //Attempt to find products based on the built query string.
        let cursor
        try {
            cursor = await productInfo.find(query).sort({[sortType]:sortOrder})
        } catch (err) {
            console.error(`Unable to issue find command, ${err}`)
            return { productList: [], totalNumProducts: 0 }
        }
        //Limit the max amount of items to query.
        const displayCursor = cursor.limit(productsPerPage).skip(productsPerPage * page)
        //Place products into an array and place the review information for each product as well.
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
            return { withReviews: [], totalNumProducts: 0 }
        }
    }

    /**
     * Function: getProductById
     * Purpose: Retrieves a specific product where it the id matches
     * @param id The id of the product
     * @returns All product information including the reviews.
     */
    static async getProductByID(id) {
        let productRes
        try {
            const pipeline = [
                {
                    $match: { _id: new ObjectId(id), },
                },
            ]
            productRes = await productInfo.aggregate(pipeline).next()
            //Add the review stats afterwards and return the full product.
            return await this.appendReviewAggregate(productRes)
        } catch(err) {
            console.error(`Unable to retrieve product information: ${err}`)
            throw err
        }
    }

    /**
     * Function: getUniqueBrands
     * Purpose: Gets every unique instance of a brand from the databse.
     * @returns {Promise<{brandList: *[]}>} An array of all the brands.
     */
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

    /**
     * Function: appendNewReview
     * Purpose: Adds a new review to the specific product that the review is associated with.
     * @param productId Id of the product to add the review to.
     * @param reviewTitle Title of the review.
     * @param reviewScore Rating out of 5 that the user game.
     * @param reviewDescription Full detailed review that the user gave.
     * @param userId Id of the user.
     * @returns status code indicating success or not, meessage to go alongside the status
     */
    static async appendNewReview(productId, reviewTitle, reviewScore, reviewDescription, userId) {
        let updateRes
        try {
            updateRes = await productInfo.updateOne({_id: new ObjectId(productId)},
                {
                    //Push a review to the reviews array.
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

    /**
     * Function: appendReviewAggregate
     * Purpose: Adds review information to the product
     * @param queryRes The product information that was retrieved
     * @returns {Promise<{reviews}|*>} The full query result that includes reviewCount and reviewScore
     */
    static async appendReviewAggregate(queryRes) {
        let totalScore = 0
        //reviewCount = The length of the reviews array
        //reviewScore = The average of all the review scores in the reviews array
        if(!queryRes.reviews || queryRes.reviews.length <= 0) {
            queryRes.reviewCount = 0
            queryRes.reviewScore = totalScore
            return queryRes
        }
        queryRes.reviewCount = queryRes.reviews.length
        //Loop through all the reviews and get the scores. Add them together and divide them by the reviews length
        //Round the score afterwards and multiply by 10 then divide by 10 to make for an even score to the tenths position
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