import { Url } from "../models/Url.model.js";

import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const shortner = AsyncHandler(async (req, res, next) => {
    const { longUrl } = req.body;
    const charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const urlBlock = await Url.create({  
        longUrl,
        owner: req.user._id,
        shortUrl: "temp"  
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
       new ApiResponse(200, `http://localhost:${process.env.PORT}/${short}`, "short url created")  
    );
});

export const redirectUrl = AsyncHandler(async (req, res, next) => {
    const { shortUrl } = req.params;
    console.log("Incoming shortCode search:", shortUrl); 

    const urlBlock = await Url.findOne({ shortUrl });
    
    if (!urlBlock) {
        console.log("Database lookup failed for:", shortUrl);
        throw new ApiError(404, "Short URL not found");
    }

    Url.updateOne({ _id: urlBlock._id }, { $inc: { clicks: 1 } }).exec();

    res.redirect(urlBlock.longUrl); 
});