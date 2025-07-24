import Measurement from "../models/Measurement.js";
import { capitalizeWords } from "../utils/format.js";

export const getAllMeasurements = async (_req, res) => {
  try {
    const measurements = await Measurement.find().sort({ createdAt: -1 });
    res.json(measurements);
  } catch {
    res.status(500).json({ message: "Failed to fetch measurements" });
  }
};

export const createMeasurement = async (req, res) => {
  try {
    const { name, units } = req.body;

    const formattedName = capitalizeWords(name.trim());
    const formattedUnits = units.map((u) => u.trim());

    const measurement = await Measurement.create({
      name: formattedName,
      units: formattedUnits,
    });

    res.status(201).json(measurement);
  } catch {
    res.status(500).json({ message: "Failed to create measurement" });
  }
};

export const updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, units } = req.body;

    const updated = await Measurement.findByIdAndUpdate(
      id,
      {
        name: capitalizeWords(name.trim()),
        units: units.map((u) => u.trim()),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update measurement" });
  }
};

export const deleteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Measurement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.json({ message: "Measurement deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete measurement" });
  }
};
