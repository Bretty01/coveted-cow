import express from 'express'
import ProductController from "./ProductController.js"

const router = express.Router()
router.route('/').get(ProductController.getProducts)
router.route('/product/:id').get(ProductController.getProductById)
router.route('/brand').get(ProductController.getUniqueBrands)
router.route('/submitreview').post(ProductController.submitReview)
export default router