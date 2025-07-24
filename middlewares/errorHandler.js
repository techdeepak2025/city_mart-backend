export const multerErrorHandler = (err, req, res, next) => {
  if (err.message?.includes("Only .jpg") || err.message?.includes("Invalid file")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};
