import express from "express";

const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
  res.send("Blogging platform API sends hello");
});

export default mainRouter;
