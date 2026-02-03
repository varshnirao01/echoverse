import express from "express";
import multer from "multer";
import Upload from "../models/Upload.js";
// import { verifyToken } from "../middleware/authMiddleware.js"; // optional if using JWT

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// POST: Upload user's sung track
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, bgm } = req.body;

    // For testing without JWT
    const userId = req.user?.id || "dummyUser"; 

    const newUpload = new Upload({
      userId,
      title,
      bgm,
      fileUrl: `/uploads/${req.file.filename}`,
      likes: 0
    });

    await newUpload.save();
    res.json({ message: "✅ Upload successful", newUpload });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: Get all uploads
router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.find().populate("userId", "username");
    res.json(uploads);
  } catch (err) {
    console.error("Get uploads error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT: Like uploaded song
router.put("/:id/like", async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    upload.likes += 1;
    await upload.save();
    res.json(upload);
  } catch (err) {
    console.error("Like upload error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
