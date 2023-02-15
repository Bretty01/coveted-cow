import express from 'express'
import UserController from "./UserController.js"

const router = express.Router()
router.route("/user/login").post(UserController.getUser)
export default router