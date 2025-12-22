import express from "express"
import { pdfProcessRouter } from "./routes/pdfProcessRoute.js";
import { functions, inngest } from "./inngest/inngestClient.js";

const app = express();

app.use(express.json())


app.get("/", (_req, res) => {
    res.status(200).send("server is up and running")
})

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api", pdfProcessRouter)

export default app;