import { models, Schema, model } from "mongoose";
const mongoose = require("mongoose");


const tripSchema = new Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: { type: String, trim: true },
    about: { type: String, trim: true },
    distance: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
  },
  { timestamps: true }
);

const trip = models.trips || model("trips", tripSchema);

module.exports = trip;
