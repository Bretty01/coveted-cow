import ProductInfoDAO from "../dao/ProductInfoDao.js"

export default class ProductController {
    static async getProducts(req, res, next) {
        const productsPerPage = req.query.productsPerPage ? parseInt(req.query.product) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
        let filters = null
        let sort = null
        let search = null
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

        const { productList, totalNumProducts } = await ProductInfoDAO.getProducts({
            filters,
            sort,
            search,
            page,
            productsPerPage
        })

        let response = {
            products: productList,
            page: page,
            filters: filters,
            sort: sort,
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

    static async getUniqueBrands(req, res, next) {
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
}