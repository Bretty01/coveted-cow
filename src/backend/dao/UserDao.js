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
        if(!email || !password) return {"userInfo": null, status: 400, message: "Please enter email and password."}
        let cursor
        try {
            cursor = await userInfo.findOne({"$and": [{"email": email}, {"password": password}]})
            if(cursor?._deleted || !cursor){
                return {status: 401, message: "Invalid Credentials"}
            }
        } catch (err) {
            console.log(err)
        }
        return {"userInfo": {"_id": cursor._id, "name": cursor.name, "email": cursor.email}}
    }

    static async createUser({email = null, password = null, name = null}) {
        if(!email || !password || !name) return {"userInfo": null, status: 400, message: "Please enter all information."}
        let cursor
        try {
            cursor = await userInfo.insertOne({
                "name": name,
                "email": email,
                "password": password,
                _deleted: false
            })
        } catch (e) {
            console.error("Unable to submit information " + e)
        }
        if(cursor) return {status: 201, message: "User successfully created."}
        else return {status: 500, message: "Something went wrong on user creation."}
    }
}