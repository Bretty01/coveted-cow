import ProductInfoDAO from "../dao/ProductInfoDao.js"

export default class ProductController {
    static async getProducts(req, res, next) {
        const productsPerPage = req.query.productsPerPage ? parseInt(req.query.product) : 12
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.name) {
            filters.name = req.query.name
        } else if (req.query.price) {
            filters.price = req.query.price
        } else if (req.query.sku) {
            filters.sku = req.query.sku
        }

        const { productList, totalNumProducts } = await ProductInfoDAO.getProducts({
            filters,
            page,
            productsPerPage
        })

        let response = {
            products: productList,
            page: page,
            filters: filters,
            entries_per_page: productsPerPage,
            total_results: totalNumProducts
        }
        res.json(response)
    }

    static async getProductById(req, res, next) {
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
}