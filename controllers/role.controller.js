import Role from "../models/Role.js";
import { capitalizeWords } from "../utils/format.js";

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const formattedName = capitalizeWords(name);

    const existing = await Role.findOne({ name: formattedName });
    if (existing) return res.status(400).json({ error: "Role already exists" });

    const newRole = await Role.create({ name: formattedName });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ error: "Failed to create role" });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const formattedName = capitalizeWords(req.body.name);

    const existing = await Role.findOne({ name: formattedName, _id: { $ne: id } });
    if (existing) return res.status(400).json({ error: "Role already exists" });

    const updated = await Role.findByIdAndUpdate(
      id,
      { name: formattedName },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Role not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update role" });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Role not found" });

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete role" });
  }
};
