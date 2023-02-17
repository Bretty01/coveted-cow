import app from "./server.js"
import mongodb from "mongodb"
import ProductInfoDAO from "./dao/ProductInfoDao.js"
import UserDao from "./dao/UserDao.js"
import * as dotenv from 'dotenv'
const MongoClient = mongodb.MongoClient
dotenv.config()
const port = process.env.PORT || 8000
MongoClient.connect(
    "mongodb+srv://Bretty0:" + process.env.MONGODB_PASS + "@cluster0.z9hba.mongodb.net/website?retryWrites=true&w=majority",
    {
        wtimeoutMS: 2500,
    }
)
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await ProductInfoDAO.injectDB(client)
        await UserDao.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })