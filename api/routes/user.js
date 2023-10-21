import express from "express";
import { login, register } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.get("/login", login);

export default userRouter;
