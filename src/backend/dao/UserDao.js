import mongodb from "mongodb"
import * as dotenv from 'dotenv'
import bcrypt from "bcrypt"
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
        const SALT_ROUNDS = 10
        if(!email || !password) return {"userInfo": null, status: 400, message: "Please enter email and password."}
        let cursor
        try {
            cursor = await userInfo.findOne({"email": email})
            const correctPassword = await bcrypt.compare(password, cursor?.password)
            if(cursor?._deleted || !cursor || !correctPassword){
                return {status: 401, message: "Invalid Credentials"}
            }
        } catch (err) {
            console.log(err)
        }
        return {"userInfo": {"_id": cursor._id, "name": cursor.name, "email": cursor.email}}
    }

    static async createUser({email = null, password = null, name = null}) {
        const SALT_ROUNDS = 10
        if(!email || !password || !name) return {"userInfo": null, status: 400, message: "Please enter all information."}
        let cursor
        try {
            const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)
            cursor = await userInfo.insertOne({
                "name": name,
                "email": email,
                "password": hashPassword,
                _deleted: false
            })
        } catch (e) {
            console.error("Unable to submit information " + e)
        }
        if(cursor) return {status: 201, message: "User successfully created."}
        else return {status: 500, message: "Something went wrong on user creation."}
    }

    static async accountExists(email) {
        const accountCount = await userInfo.countDocuments({"email": email})
        return accountCount > 0
    }

    static async deleteUser(id) {
        let statusCode
        const deleteRes = await userInfo.updateOne({_id: new ObjectId(id)},
            {$set: {_deleted: true}})
        console.log(deleteRes)
        deleteRes.modifiedCount === 1 ? statusCode = {status: 200, message: "User successfully deleted."} :
        statusCode = {status: 500, message: "Something went wrong upon deleting user."}
        return statusCode
    }

    static async updatePassword(id, oldPassword, newPassword) {
        let statusCode
        const SALT_ROUNDS = 10
        let cursor
        if(!id || !oldPassword || !newPassword) return {status: 400, message: "Missing id or passwords."}

            cursor = await userInfo.findOne({"_id": new ObjectId(id)})
            const correctPassword = await bcrypt.compare(oldPassword, cursor?.password)
            if(!correctPassword){
                return {status: 401, message: "Your old password may be incorrect. Please check your password"}
            }
            const hashPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
            const updateRes = await userInfo.updateOne({_id: new ObjectId(id)},
                {$set: {password: hashPassword}})
            console.log(updateRes)
            updateRes.modifiedCount === 1 ? statusCode = {status: 200, message: "Password successfully updated."} :
                statusCode = {status: 500, message: "Something went wrong upon updating password."}

        return statusCode
    }

}