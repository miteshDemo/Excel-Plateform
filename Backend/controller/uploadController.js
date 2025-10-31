import Upload from "../models/Upload.js";

export const getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user._id });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
