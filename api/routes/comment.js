import express from "express";
import { createComment, deleteComment } from "../controllers/comment.js";

const commentRouter = express.Router();

commentRouter.post("/create", createComment);
commentRouter.post("/delete", deleteComment);

export default commentRouter;
