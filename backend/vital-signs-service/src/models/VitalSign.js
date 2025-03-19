import mongoose from "mongoose";

const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  heartRate: { type: Number, required: true, min: 30, max: 250 },
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
  },
  temperature: { type: Number, required: true, min: 34, max: 43 },
  oxygenSaturation: { type: Number, required: false, min: 80, max: 100 }, // ADDED FIELD
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VitalSign", vitalSchema);