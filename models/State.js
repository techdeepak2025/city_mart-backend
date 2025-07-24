import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Cascade delete Cities and Stores
stateSchema.pre("findOneAndDelete", async function (next) {
  const stateId = this.getQuery()._id;
  const City = mongoose.model("City");
  const Store = mongoose.model("Store");

  const cities = await City.find({ state: stateId });
  const cityIds = cities.map(city => city._id);

  await City.deleteMany({ state: stateId });
  await Store.deleteMany({
    $or: [
      { state: stateId.toString() },
      { city: { $in: cityIds.map(id => id.toString()) } },
    ],
  });

  next();
});

export default mongoose.model("State", stateSchema);
