import UserDao from "../dao/UserDao.js"
export default class UserController {
    static async getUser(req, res) {
        const {userInfo = null , status = null, message = null} =
            await UserDao.getUser({email: req.body.email, password: req.body.password})
        if(status) return res.status(status).json({"message": message})
        res.status(200).json({"userInfo": userInfo, "status": status, "message": message})
    }
    static async createUser(req, res) {
        const accountExists = await UserDao.accountExists(req.body.email)
        if(accountExists) return  res.status(400).json({message: "An account already exists under this email address."})
        const {status = null, message = null} = await UserDao.createUser(
            {email: req.body.email, password: req.body.password, name: req.body.name})
        res.status(status).json({"message": message})
    }
    static async deleteUser(req, res) {
        if(!req.body.id) return res.status(400).json({message: "Please give a user id."})
        const {status = null, message = null} = await UserDao.deleteUser(req.body.id)
        res.status(status).json({"message": message})
    }
    static setCookie(req, res) {
        res.cookie('login', req.body.logininfo, {
            httpOnly: true,
            //1000ms/s * 60s/m, 60m/h = 1 hour
            maxAge: 1000 * 60 * 60
        })
        res.send("Cookie has been set")
    }
    static getCookie(req, res) {
        console.log(req.cookies)
        res.send(req.cookies)
    }

    static deleteCookie(req, res) {
        res.clearCookie("login")
        res.send("Cookie deleted")
    }

    static async updatePassword(req, res) {
        const {status = null, message = null} =
            await UserDao.updatePassword(req.body.id, req.body.oldPassword, req.body.newPassword)
        res.status(status).json({"message": message})
    }
}