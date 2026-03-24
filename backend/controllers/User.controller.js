import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import User from "../models/User.model.js";

const registerUser=AsyncHandler(async(req,res)=>{
   //rgt data from frontend
//validate data ,no emtpty strings
//get avatar and coevr iamge
//if useralready exixts
//upload image on cloudinary
//check if images are succesfully uploaed
//creat euser object
//remove password and refresh token

const {fullName,email,password}=req.body
console.log("body",req.body)

if(
    [fullName,email,password].some((field)=>field.trim()==="")
)
{ throw new ApiError(401,"all fileds are required")}

else{
    const ifexist= await User.findOne({
       email
    })

     if(ifexist) throw new ApiError(409,"user already exixts");

     const user=await User.create({
        
         email,
         password,
        fullName,

     })
     if(!user) throw new ApiError(500,"something went wrong in registration");

     console.log(user);

     const createdUser= await User.findById(user._id).select(
        "-password  -refreshToken"
     )
if(!createdUser)throw new ApiError(500,"something went wrong in registration");

 return res.status(201).json(
     new ApiResponse(200,createdUser," account craeted successfully")
)


}
});

const generateAccessAndRfreshToken=async(userId)=>{

    try{
        const user= await User.findById(userId);

    if(!user) throw new ApiError(500,"something went wrong in finding user");

    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
 user.refreshToken=refreshToken;
    user.save({validateBeforeSave:false});
      return {accessToken,refreshToken}
}

    catch(error){
        console.error("Error generating tokens:", error);
        throw new ApiError(501,"something went wrong in generating tokens");
    }
      
    };

    const loginUser=AsyncHandler(async(req,res)=>{


    console.log("login req body",req.body);
const {email,password}=req.body;




   

console.log("email",email);
if(!email )
    throw new ApiError(400," email required");

const user = await User.findOne({
   email
});

if(!user)throw new ApiError(401 ,"user does not exist");

    if((!user.isPasswordCorrect(password))) throw new ApiError(402,"invalid credentials");

   const {accessToken,refreshToken} = await generateAccessAndRfreshToken(user._id);

   const logginedUser=await User.findById(user._id).select("-password -refreshToken");
   
   const options=[{
    httpOnly:true,
    secure:true,
    sameSite: "none", 
   }
   ]

res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            user:logginedUser,refreshToken,accessToken
        },
        "user loggined successfully"
    )
 
)

});

const loggout=AsyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
{
    $set:{
        refreshToken:undefined
    }
    
}
,{
      new:true
    },
    )

   const  options=[{
        httpOnly:true,
    }]

    res.
    status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(
        new ApiResponse(200,{},"user loggout succesfully"
    )
)


});

export {registerUser,loginUser,loggout};