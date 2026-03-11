import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import cookieParser from 'cookie-parser';


export const  verifyJwt=AsyncHandler(async(req,res,next)=>{
     
  try {

    console.log("cookies",req.cookies);
      const token= await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token)throw new ApiError(404,"unauthorized access");
 
    const decodedToken= jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,

    )

    const user=await User.findById(decodedToken._id);
    if(!user) throw new ApiError(400 ,"invalid accesss token");

    req.user=user;
    next();
  } catch (error) {
    throw new ApiError(400, error?.message||"invalid accessToken ")
  }

})