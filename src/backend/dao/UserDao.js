import mongodb from "mongodb"
import bcrypt from "bcrypt"
const ObjectId = mongodb.ObjectId
let userInfo

export default class UserDao {
    /**
     * Function: injectDB
     * Purpose: Initializes connection the to the "user" mongoDB collection
     */
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

    /**
     * Function: getUser
     * Purpose: Verifies indentity and gets a user object
     * @param email The email of the user
     * @param password The password of the user
     * @returns status code, message for the status, and user information if applicable
     */
    static async getUser({email = null, password = null}){
        if(!email || !password) return {"userInfo": null, status: 400, message: "Please enter email and password."}
        let cursor
        try {
            //Get the user and compare the password. If the user can't be grabbed, or the password is incorrect,
            //  throw an error.
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

    /**
     * Function: createUser
     * Purpose: Adds a user object into the database
     * @param email Email of the user.
     * @param password Password of the user.
     * @param name Username of the user
     * @returns status code of the submission, message to go along with the status, id of the new user if applicable.
     */
    static async createUser({email = null, password = null, name = null}) {
        const SALT_ROUNDS = 10
        if(!email || !password || !name) return {"userInfo": null, status: 400, message: "Please enter all information."}
        let cursor
        try {
            //Hash/salt the password so it is securely placed in the database.
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
        if(cursor) return {status: 201, message: "User successfully created.", id: cursor.insertedId}
        else return {status: 500, message: "Something went wrong on user creation."}
    }

    /**
     * Function: accountExists
     * Purpose: Checks if the email has been used for another account.
     * @param email Email to query into the database
     * @returns {Promise<boolean>} if 1 or more accounts are found, returns true
     */
    static async accountExists(email) {
        const accountCount = await userInfo.countDocuments({"email": email})
        return accountCount > 0
    }

    /**
     * Function: deleteUser
     * Purpose: Deletes the user's account.
     * @param id The id of the account to delete
     * @returns {Promise<{message: string, status: number}>} status: Status code of the deletion,
     *              message: message to go alongside the status code
     */
    static async deleteUser(id) {
        let statusCode
        /**
         * I do not delete the document, but rather set the _deleted variable to "true".
         * This is because the account will need to exist so that the user information is still accessible for the
         * review.
         */
        const deleteRes = await userInfo.updateOne({_id: new ObjectId(id)},
            {$set: {_deleted: true}})
        //Throw success or error code based on the result of the deletion.
        deleteRes.modifiedCount === 1 ? statusCode = {status: 200, message: "User successfully deleted."} :
        statusCode = {status: 500, message: "Something went wrong upon deleting user."}
        return statusCode
    }

    /**
     * Function: updatePassword
     * Purpose: updates the password of the user in the database
     * @param id Id of the user.
     * @param oldPassword The previous password to be changed.
     * @param newPassword The updated password to be inserted.
     * @returns {Promise<{message: string, status: number}|{message: string, status: number}|{message: string, status: number}>}
     */
    static async updatePassword(id, oldPassword, newPassword) {
        let statusCode
        const SALT_ROUNDS = 10
        let cursor
        if(!id || !oldPassword || !newPassword) return {status: 400, message: "Missing id or passwords."}
            //Find the user and compare the old password to ensure it is correct.
            cursor = await userInfo.findOne({"_id": new ObjectId(id)})
            const correctPassword = await bcrypt.compare(oldPassword, cursor?.password)
            if(!correctPassword){
                return {status: 401, message: "Your old password may be incorrect. Please check your password"}
            }
            //Hash/salt the new password to be inserted into the database.
            const hashPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
            const updateRes = await userInfo.updateOne({_id: new ObjectId(id)},
                {$set: {password: hashPassword}})
            //Throw status code based on if the user got updated accordingly.
            updateRes.modifiedCount === 1 ? statusCode = {status: 200, message: "Password successfully updated."} :
                statusCode = {status: 500, message: "Something went wrong upon updating password."}
        return statusCode
    }

    static async getUserById(id) {
        return await userInfo.findOne({"_id": new ObjectId(id)})
    }
}