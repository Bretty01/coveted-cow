import express from 'express'
import UserController from "./UserController.js"

const router = express.Router()
router.route("/user/login").post(UserController.getUser)
router.route("/user/create").post(UserController.createUser)
router.route("/user/delete").post(UserController.deleteUser)
router.route("/user/setcookie").post(UserController.setCookie)
router.route("/user/getcookie").get(UserController.getCookie)
router.route("/user/deletecookie").get(UserController.deleteCookie)
router.route("/user/updatepassword").post(UserController.updatePassword)


export default router