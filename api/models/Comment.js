import mongoose from "mongoose";

const comment = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  blogPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
  },
});

const commentSchema = mongoose.model("Comment", comment);

export default commentSchema;
