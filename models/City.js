import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
  },
  { timestamps: true }
);

// Cascade delete: Remove stores when a city is deleted
citySchema.pre("findOneAndDelete", async function (next) {
  const cityId = this.getQuery()._id;
  const Store = mongoose.model("Store");

  await Store.deleteMany({ city: cityId.toString() });
  next();
});

export default mongoose.model("City", citySchema);
