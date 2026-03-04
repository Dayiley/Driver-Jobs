const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please provide company name"],
      trim: true,
      maxlength: 80,
    },
    positionTitle: {
      type: String,
      required: [true, "Please provide position title"],
      trim: true,
      maxlength: 80,
    },
    detailsUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String, 
      trim: true,
      maxlength: 800,
    },
   
    imageFile: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);