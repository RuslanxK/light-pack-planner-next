import { models, Schema, model } from "mongoose"

const itemSchema = new Schema({

    creator: {
        type: String
      },
    tripId: String,
    bagId: String,
    categoryId: String,
    name: { type: String, trim: true},
    qty: { type: Number, min: 1 },
    description: { type: String, trim: true },
    weight: { type: Number, min: 0.1 },
    priority: { type: String, trim: true, default: "low" },
    link: String,
    worn: {type: Boolean, default: false},
    productImageKey: { type: String, default: null },
    order: {type: Number, default: null},
    price: {type: Number, default: 0.00},
   
   

}, { timestamps: true })



const item = models.items || model("items", itemSchema)

module.exports = item