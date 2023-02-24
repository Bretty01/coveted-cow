import ProductInfoDAO from "../dao/ProductInfoDao.js"

export default class ProductController {
    static async getProducts(req, res, next) {
        const productsPerPage = req.query.productsPerPage ? parseInt(req.query.product) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
        let filters = null
        let sort = null
        let search = null
        //Determine what to query based on the passed in parameters
        if(req.query.filters) {
            filters = JSON.parse(req.query.filters)
        } else if (req.query.sku) {
            filters = {sku : req.query.sku}
        }
        if (req.query.search) {
            search = req.query.search
        }
        if(req.query.sort) {
            sort = req.query.sort
            var split = sort.split(',')
            sort = {
                type:split[0],
                order:split[1]
            }
        }

        //Pass all the parsed parameters into the DAO to retrieve a list of products
        const { withReviews, totalNumProducts } = await ProductInfoDAO.getProducts({
            filters,
            sort,
            search,
            page,
            productsPerPage
        })

        //Take the response and return it in json format
        let response = {
            products: withReviews,
            page: page,
            filters: filters,
            sort: sort,
            entries_per_page: productsPerPage,
            total_results: totalNumProducts
        }
        res.json(response)
    }


    static async getProductById(req, res, next) {
        //Attempt to retrieve a product based on a specific product id and return it back to the user.
        try {
            let id = req.params.id || {}
            let product  = await ProductInfoDAO.getProductByID(id)
            if(!product) {
                res.status(404).json({error: "Not found"})
                return
            }
            res.json(product)
        } catch (err) {
            console.log(`api problem, ${err}`)
            res.status(500).json({ error: err })
        }
    }

    static async getUniqueBrands(req, res, next) {
        //Get every distinct brand and return it back as an array
        try {
            let product  = await ProductInfoDAO.getUniqueBrands()
            if(!product) {
                res.status(404).json({error: "Not found"})
                return
            }
            res.json(product)
        } catch (err) {
            console.log(`api problem, ${err}`)
            res.status(500).json({ error: err })
        }
    }

    static async submitReview(req, res) {
        //If certain information was not filled out, return a 400 code error
        if(!req.body.reviewTitle || !req.body.reviewScore || !req.body.reviewDescription)
            return res.status(400).json({message: "Please enter all required information."})
        //Attempt to submit review if all information is present.
        const {status, message} = await ProductInfoDAO.appendNewReview(req.body.productId, req.body.reviewTitle,
            req.body.reviewScore, req.body.reviewDescription, req.body.userId)
        res.status(status).json({"message": message})
    }
}