import UserDao from "../dao/UserDao.js"

export default class UserController {
    static async getUser(req, res) {
        const {userInfo = null , status = null, message = null} =
            await UserDao.getUser({email: req.body.email, password: req.body.password})
        if(status) return res.status(status).json({"message": message})
        res.status(200).json({"userInfo": userInfo, "status": status, "message": message})
    }
}