import { Router } from "express";
import {
  shortner,
  getUrlAnalytics,
  getUserUrls,
  getCurrentUser,
} from "../controllers/Url.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

export const Url = Router();

Url.route("/").post(verifyJwt, shortner);
Url.get("/me", verifyJwt, getCurrentUser);
Url.get("/urls", verifyJwt, getUserUrls);

Url.route("/:id").get(verifyJwt, getUrlAnalytics);
