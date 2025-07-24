import City from "../models/City.js";
import { capitalizeWords } from "../utils/format.js";

// GET /cities?state=<state_id>
export const getCities = async (req, res) => {
  try {
    const { state } = req.query;
    const filter = state ? { state } : {};
    const cities = await City.find(filter)
      .populate("state", "name")
      .sort({ name: 1 });

    res.json(cities);
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// POST /cities
export const createCity = async (req, res) => {
  try {
    const { name, state } = req.body;
    const formattedName = capitalizeWords(name);

    const existing = await City.findOne({ name: formattedName, state });
    if (existing) {
      return res.status(400).json({ error: "City already exists in selected state" });
    }

    const city = await City.create({ name: formattedName, state });
    res.status(201).json(city);
  } catch (err) {
    console.error("Error creating city:", err);
    res.status(500).json({ error: "Failed to create city" });
  }
};

// PUT /cities/:id
export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state } = req.body;
    const formattedName = capitalizeWords(name);

    const existing = await City.findOne({
      name: formattedName,
      state,
      _id: { $ne: id },
    });
    if (existing) {
      return res.status(400).json({ error: "Another city with this name already exists in the selected state" });
    }

    const city = await City.findByIdAndUpdate(
      id,
      { name: formattedName, state },
      { new: true, runValidators: true }
    );

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json(city);
  } catch (err) {
    console.error("Error updating city:", err);
    res.status(500).json({ error: "Failed to update city" });
  }
};

// DELETE /cities/:id
export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await City.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json({ message: "City deleted successfully" });
  } catch (err) {
    console.error("Error deleting city:", err);
    res.status(500).json({ error: "Failed to delete city" });
  }
};
