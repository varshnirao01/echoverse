import express from "express";
import Song from "../models/Song.js";

const router = express.Router();

// ✅ Default songs if DB is empty
const defaultSongs = {
  English: [
    { title: "Shape of You", artist: "Ed Sheeran", fileUrl: "/uploads/shape_of_you.mp3" },
    { title: "Blinding Lights", artist: "The Weeknd", fileUrl: "/uploads/blinding_lights.mp3" },
  ],
  Telugu: [
    { title: "Butta Bomma", artist: "Armaan Malik", fileUrl: "/uploads/butta_bomma.mp3" },
    { title: "Samajavaragamana", artist: "Sid Sriram", fileUrl: "/uploads/samajavaragamana.mp3" },
  ],
  Hindi: [
    { title: "Tum Hi Ho", artist: "Arijit Singh", fileUrl: "/uploads/tum_hi_ho.mp3" },
    { title: "Kesariya", artist: "Arijit Singh", fileUrl: "/uploads/kesariya.mp3" },
  ],
};

// ✅ Fetch songs by language
router.get("/:language", async (req, res) => {
  const { language } = req.params;

  try {
    const songs = await Song.find({ language });
    if (songs.length > 0) return res.json(songs);

    // If DB is empty, return default songs
    res.json(defaultSongs[language] || []);
  } catch (err) {
    console.error("Error fetching songs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
