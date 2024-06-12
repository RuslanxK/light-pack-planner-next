import { models, Schema, model } from "mongoose"


const articleSchema = new Schema({

    title: { type: String, trim: true },
    description: { type: String, trim: true },
    imageKey: String
  },
  
  { timestamps: true }
  
);


const article = models.articles || model("articles", articleSchema)

module.exports = article