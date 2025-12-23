import {Router} from "express";
import { askQueryDF } from "../controllers/queryController.js";

export const queryRouter = Router();

queryRouter.post("/query", askQueryDF)