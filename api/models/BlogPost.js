import mongoose from "mongoose";

const blogPost = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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
  categories: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const blogPostSchema = mongoose.model("BlogPost", blogPost);

export default blogPostSchema;
