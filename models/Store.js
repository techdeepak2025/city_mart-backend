import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{2,5}\d{3,5}$/, "Invalid store number format (e.g., HR001)"],
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{6}$/, "Pincode must be a 6-digit number"],
    },
  },
  { timestamps: true }
);

storeSchema.index({ city: 1, pincode: 1 });

export default mongoose.model("Store", storeSchema);
