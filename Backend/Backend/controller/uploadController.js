import Upload from "../models/Upload.js"; 

// Get recent 5 uploads
export const getRecentUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get total upload count for current user
export const getUploadCount = async (req, res) => {
  try {
    const count = await Upload.countDocuments({ user: req.user._id });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
