import mongoose from "mongoose";
import { Counter } from "./Counter.model.js";
const urlSchema= new mongoose.Schema({

    longUrl:{
        type:String,
        required:true
    },
    shortUrl:{
        type:String,
        
    },
    owner:{
       type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    ,
    clicks:{
        type:Number,
    },
   universalId:{
        type:Number,
        default:0

    },

},{timestamps:true})

urlSchema.pre("save", async function () {
if (this.isNew) { 
    const doc = await Counter.findOneAndUpdate(
        { _id: 'url_count' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true }
    );

    this.universalId = doc.seq;}

    
});
 export const  Url=mongoose.model("url",urlSchema);