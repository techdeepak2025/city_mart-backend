import Store from "../models/Store.js";

// GET all stores
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("state", "name")
      .populate("city", "name")
      .sort({ createdAt: -1 });

    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ message: "Server error while fetching stores" });
  }
};

// GET store by ID
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate("state", "name")
      .populate("city", "name");

    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching store" });
  }
};

// POST create store
export const createStore = async (req, res) => {
  try {
    const { storeNumber, state, city, address, pincode } = req.body;

    const store = new Store({
      storeNumber: storeNumber.toUpperCase(),
      state,
      city,
      address,
      pincode,
    });

    const savedStore = await store.save();
    res.status(201).json(savedStore);
  } catch (err) {
    console.error("Error creating store:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Store number must be unique" });
    }
    res.status(400).json({ message: err.message });
  }
};

// PUT update store
export const updateStore = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.storeNumber) updates.storeNumber = updates.storeNumber.toUpperCase();

    const updatedStore = await Store.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json(updatedStore);
  } catch (err) {
    console.error("Error updating store:", err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE store
export const deleteStore = async (req, res) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Store not found" });

    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting store" });
  }
};
