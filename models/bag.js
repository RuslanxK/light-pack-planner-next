import { Type } from "@aws-sdk/client-s3";
import { models, Schema, model } from "mongoose"
import mongoose from "mongoose";

const bagSchema = new Schema({

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    },
    
    tripId: String,
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    weight: { type: Number, min: 0, default: 0 },
    goal: { type: Number, min: 0 },
    capacity: { type: String, trim: true },
    passed: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    exploreBags: {type: Boolean, default: true}
  
   
  },
  { timestamps: true }
  
);


const bag = models.bags || model("bags", bagSchema)

module.exports = bag