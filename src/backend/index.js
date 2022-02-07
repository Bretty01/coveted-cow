import app from "./server.js"
import mongodb from "mongodb"
import ProductInfoDAO from "./dao/ProductInfoDao.js"
const MongoClient = mongodb.MongoClient

const port = 5000 || 8000

MongoClient.connect(
    "mongodb+srv://Bretty0:H45Q3ghDLMmJYQRt@cluster0.z9hba.mongodb.net/website?retryWrites=true&w=majority",
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
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })