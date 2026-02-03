import express from "express";
import Song from "../models/Song.js";

const router = express.Router();

// Get all songs
router.get("/", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// Update song playback speed (Disk feature)
router.put("/:id/speed", async (req, res) => {
  const { speed } = req.body;
  const updated = await Song.findByIdAndUpdate(req.params.id, { speed }, { new: true });
  res.json(updated);
});

// Like song
router.put("/:id/like", async (req, res) => {
  const song = await Song.findById(req.params.id);
  song.likes += 1;
  await song.save();
  res.json(song);
});

export default router;
