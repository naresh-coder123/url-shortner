import { Router } from "express";
import { shortner, redirectUrl } from "../controllers/Url.controller.js";
import { verifyJwt } from "../middlewares/Auth.middleware.js";

export const UrlShortner=Router();

UrlShortner.route("/").post(verifyJwt, shortner);

