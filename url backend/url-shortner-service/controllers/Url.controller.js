import { Url } from "../models/Url.model.js";

import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createClient } from "redis";
const redisClient = createClient();
await redisClient.connect();

export const shortner = AsyncHandler(async (req, res, next) => {
  const { longUrl } = req.body;
  const charSet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const urlBlock = await Url.create({
    longUrl,
    owner: req.user._id,
    shortUrl: "temp",
  });

  let num = urlBlock.universalId;
  let short = "";

  if (num === 0) {
    short = charSet[0];
  } else {
    while (num > 0) {
      short = charSet[num % 62] + short;
      num = Math.floor(num / 62);
    }
  }

  urlBlock.shortUrl = short;
  await urlBlock.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: urlBlock._id,
        shortUrl: `http://localhost:${process.env.PORT}/${short}`,
        longUrl: urlBlock.longUrl,
        clicks: urlBlock.clicks || 0,
      },
      "short url created",
    ),
  );
});

export const redirectUrl = AsyncHandler(async (req, res, next) => {
  const { shortUrl } = req.params;
  console.log("Incoming shortCode search:", shortUrl);

  const cachedUrl = await redisClient.get(`short:${shortUrl}`);

  if (cachedUrl) {
    console.log("CACHE HIT ⚡");
    Url.updateOne({ shortUrl }, { $inc: { clicks: 1 } }).exec();

    const userAgent = req.get("User-Agent");
    const metadata = {
      device: userAgent.includes("Mobile") ? "Mobile" : "Desktop",
      browser: userAgent.split(" ")[0], // Simplistic browser detection
      referrer: req.get("Referrer") || "Direct",
    };

    Url.updateOne(
      { shortUrl },
      {
        $push: { analytics: metadata },
      },
    ).exec();
    return res.redirect(cachedUrl);
  }

  const urlBlock = await Url.findOne({ shortUrl });

  if (!urlBlock) {
    console.log("Database lookup failed for:", shortUrl);
    throw new ApiError(404, "Short URL not found");
  }

  await redisClient.set(`short:${shortUrl}`, urlBlock.longUrl, { EX: 86400 });
  Url.updateOne({ _id: urlBlock._id }, { $inc: { clicks: 1 } }).exec();

  const userAgent = req.get("User-Agent");
  const metadata = {
    device: userAgent.includes("Mobile") ? "Mobile" : "Desktop",
    browser: userAgent.split(" ")[0], // Simplistic browser detection
    referrer: req.get("Referrer") || "Direct",
  };

  Url.updateOne(
    { shortUrl },
    {
      $push: { analytics: metadata },
    },
  ).exec();

  res.redirect(urlBlock.longUrl);
});

export const getUrlAnalytics = AsyncHandler(async (req, res) => {
  const { id } = req.params; // The MongoDB _id of the URL block

  const urlData = await Url.findById(id).select(
    "longUrl shortUrl clicks analytics",
  );

  if (!urlData) throw new ApiError(404, "URL not found");

  res.status(200).json(new ApiResponse(200, urlData, "Analytics retrieved"));
});

export const getUserUrls = AsyncHandler(async (req, res) => {
  const urls = await Url.find({ owner: req.user._id })
    .select("longUrl shortUrl clicks createdAt")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, urls, "User URLs fetched successfully"));
});

export const getCurrentUser = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});
