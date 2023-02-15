import mongodb from "mongodb"
import * as dotenv from 'dotenv'
dotenv.config()
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
    static async getUser({email = null, password = null}){
        if(!email || !password) return {"userInfo": null, status: 401, message: "Please enter username and password."}
        let cursor
        try {
            cursor = await userInfo.findOne({"$and": [{"email": email}, {"password": password}]})
            console.log(cursor)
            if(cursor?._deleted || !cursor){
                return {status: 401, message: "Invalid Credentials"}
            }
        } catch (err) {
            console.log(err)
        }
        return {"userInfo": {"_id": cursor._id, "name": cursor.name, "email": cursor.email}}
    }
}