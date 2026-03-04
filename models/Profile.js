const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide full name"],
      minlength: 3,
      maxlength: 80,
      trim: true,
    },
    positionType: {
      type: String,
      enum: ["driver", "dispatcher", "mechanic", "other"],
      required: [true, "Please select a position type"],
    },
    yearsExperience: {
      type: Number,
      min: [0, "Years of experience cannot be negative"],
      max: [80, "Years of experience seems too high"],
      default: 0,
    },
    state: {
      type: String,
      required: [true, "Please provide a state (2 letters)"],
      uppercase: true,
      minlength: 2,
      maxlength: 2,
      trim: true,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
