import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let userInfo

export default class UserDao {
    static async injectDB(connect) {
        if(userInfo) {
            return
        }
        try {
            userInfo = await connect.db("website").collection("user")
        } catch (err) {
            console.error(`Unable to establish a connection in UserDao: ${err}`, )
        }
    }
}