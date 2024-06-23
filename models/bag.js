import { models, Schema, model } from "mongoose"
import mongoose from "mongoose";

const bagSchema = new Schema({

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    },
    
    tripId: String,
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    goal: { type: Number, min: 0 },
    passed: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    exploreBags: {type: Boolean, default: false}
  
   
  },
  { timestamps: true }
  
);


const bag = models.bags || model("bags", bagSchema)

module.exports = bag