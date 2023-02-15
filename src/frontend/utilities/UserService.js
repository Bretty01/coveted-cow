import http from "../http-common"

class UserService {
    async loginUser(email, password) {
        return await http.post("/user/login", {
            "email": email,
            "password": password
        })
    }
}

export default new UserService()