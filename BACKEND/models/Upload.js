import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  bgm: { type: String },
  fileUrl: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

export default mongoose.models.Upload || mongoose.model("Upload", uploadSchema);
