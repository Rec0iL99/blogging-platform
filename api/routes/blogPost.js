import express from "express";
import {
  createPost,
  deletePost,
  post,
  posts,
  updatePost,
} from "../controllers/blogPost.js";

const blogPostRouter = express.Router();

blogPostRouter.post("/create", createPost);
blogPostRouter.post("/update", updatePost);
blogPostRouter.post("/delete", deletePost);
blogPostRouter.post("/post", post);
blogPostRouter.post("/posts", posts);

export default blogPostRouter;
