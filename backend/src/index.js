import express from "express"
import { pdfProcessRouter } from "./routes/pdfProcessRoute.js";

const app = express();

app.use(express.json())


app.get("/", (_req, res) => {
    res.status(200).send("server is up and running")
})

app.use("/api", pdfProcessRouter)

export default app;