import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  url: String,
  speed: { type: Number, default: 1.0 },
  likes: { type: Number, default: 0 }
});

export default mongoose.models.Song || mongoose.model("Song", songSchema);
