import {Router} from "express";
import { uploadPDF } from "../controllers/pdfProcessController.js";
import multer from "multer"

export const pdfProcessRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

pdfProcessRouter.post("/upload",upload.single("pdf"), uploadPDF)