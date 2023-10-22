import express from "express";
import { createPost, deletePost, updatePost } from "../controllers/blogPost.js";

const blogPostRouter = express.Router();

blogPostRouter.post("/create", createPost);
blogPostRouter.post("/update", updatePost);
blogPostRouter.post("/delete", deletePost);

export default blogPostRouter;
