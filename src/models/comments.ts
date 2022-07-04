import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: false,
    unique: false,
  },
  comment: {
    type: String,
    required: false,
  },

  restaurantId: {
    type: String,
    required: false,
  },
  serverTimeStamp: {
    type: String,
    required: false,
  },
});

const Comments = mongoose.model("Comments", userSchema);

export default Comments;
