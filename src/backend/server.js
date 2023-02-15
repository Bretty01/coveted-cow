import express from "express"
import cors from "cors"
import productInfo from "./api/productinfo.js"
import userRouter from "./api/UserRouter.js";

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1", productInfo)
app.use("/api/v1", userRouter)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app