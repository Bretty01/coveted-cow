import express from 'express'
import ProductController from "./ProductController.js"

const router = express.Router()
router.route('/').get(ProductController.apiGetProducts)

export default router