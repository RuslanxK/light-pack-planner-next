import { models, Schema, model } from "mongoose"


const changeLogSchema = new Schema({

    title: { type: String, trim: true },
    description: { type: String, trim: true },
    
  },
  
  { timestamps: true }
  
);


const changelog = models.changelog || model("changelog", changeLogSchema)

module.exports = changelog