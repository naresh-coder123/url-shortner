import { Router } from "express";
import {
  shortner,
  getUrlAnalytics,
  getUserUrls,
} from "../controllers/Url.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

export const Url = Router();

Url.route("/").post(verifyJwt, shortner);
Url.route("/:id").post(verifyJwt, getUrlAnalytics);
Url.get("/urls", verifyJwt, getUserUrls);
