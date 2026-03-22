import { Redis } from "@upstash/redis"; // Updated Import
import { Url } from "../models/Url.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const redisClient = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
//   enableAutoPipelining: false,
// });
/*  */
let redisClient;

const getRedis = () => {
  if (!redisClient) {
    console.log("Initializing Redis with:", process.env.UPSTASH_REDIS_REST_URL);

    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redisClient;
};
/*  */
const updateAnalytics = async (shortUrl, req) => {
  const userAgent = req.get("User-Agent") || "";
  const metadata = {
    device: userAgent.includes("Mobile") ? "Mobile" : "Desktop",
    browser: userAgent.split(" ")[0] || "Unknown",
    referrer: req.get("Referrer") || "Direct",
    timestamp: new Date(),
  };

  return Url.updateOne(
    { shortUrl },
    {
      $inc: { clicks: 1 },
      $push: { analytics: metadata },
    },
  ).exec();
};

export const shortner = AsyncHandler(async (req, res) => {
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

  // Base62 Encoding
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
  const baseUrl = `http://localhost:${process.env.PORT}`;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: urlBlock._id,
        shortUrl: `${baseUrl}/${short}`,
        longUrl: urlBlock.longUrl,
        clicks: 0,
      },
      "short url created",
    ),
  );
});

export const redirectUrl = AsyncHandler(async (req, res) => {
  const { shortUrl } = req.params;

  const redis = getRedis();
  const cachedUrl = await redis.get(`short:${shortUrl}`);

  if (cachedUrl) {
    console.log("CACHE HIT ⚡");
    updateAnalytics(shortUrl, req);
    return res.redirect(cachedUrl);
  }

  const urlBlock = await Url.findOne({ shortUrl });

  if (!urlBlock) {
    throw new ApiError(404, "Short URL not found");
  }

  // 3. Set Upstash Cache (Expires in 24h)
  await redis.set(`short:${shortUrl}`, urlBlock.longUrl, { ex: 86400 });

  // 4. Update Analytics
  await updateAnalytics(shortUrl, req);

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
