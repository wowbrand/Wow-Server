import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: false,
  },
  likeId: {
    type: String,
    required: true,
  },
});

const Likes = mongoose.model("likes", userSchema);

export default Likes;
