import express from "express";
import { serve } from "inngest/express";
import { pdfProcessRouter } from "./routes/pdfProcessRoute.js";
import { functions, inngest } from "./inngest/inngestClient.js";
import { queryRouter } from "./routes/queryRoute.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json())


app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/page.html"));
})

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api", pdfProcessRouter)
app.use("/api", queryRouter)

export default app;