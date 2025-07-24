import State from "../models/State.js";
import { capitalizeWords } from "../utils/format.js";

// GET: All states
export const getAllStates = async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 });
    res.json(states);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch states" });
  }
};

// POST: Create state
export const createState = async (req, res) => {
  try {
    const { name } = req.body;
    const formattedName = capitalizeWords(name.trim());

    const exists = await State.findOne({ name: formattedName });
    if (exists) {
      return res.status(400).json({ error: "State already exists" });
    }

    const state = await State.create({ name: formattedName });
    res.status(201).json(state);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: "Failed to create state" });
  }
};

// PUT: Update state
export const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const formattedName = capitalizeWords(name.trim());

    const duplicate = await State.findOne({ name: formattedName, _id: { $ne: id } });
    if (duplicate) {
      return res.status(400).json({ error: "Another state with this name already exists" });
    }

    const updated = await State.findByIdAndUpdate(
      id,
      { name: formattedName },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "State not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update state" });
  }
};

// DELETE: Delete state
export const deleteState = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await State.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "State not found" });
    }

    res.json({ message: "State deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete state" });
  }
};
