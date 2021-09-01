import express from 'express'
import ProductController from "./ProductController.js"

const router = express.Router()
router.route('/').get(ProductController.getProducts)
router.route('/product/:id').get(ProductController.getProductById)

export default router