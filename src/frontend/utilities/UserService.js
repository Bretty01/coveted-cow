import http from "../http-common"

class UserService {
    async loginUser(email, password) {
        return await http.post("/user/login", {
            "email": email,
            "password": password
        })
    }
    async signupUser(email, password, user){
        return await http.post("/user/create", {
            "email": email,
            "password": password,
            "name": user
        })
    }
    async setCookie(userInfo){
        return await http.post("/user/setcookie", {
            "logininfo": userInfo
        })
    }
    async getCookie(){
        return await http.get("/user/getcookie")
    }

    async deleteCookie() {
        return await http.get("/user/deletecookie")
    }
}

export default new UserService()