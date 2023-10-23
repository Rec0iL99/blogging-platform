import express from "express";
import mainRouter from "./routes/main.js";
import os from "os";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import cors from "cors";
import blogPostRouter from "./routes/blogPost.js";
import commentRouter from "./routes/comment.js";

const main = async () => {
  // initializing the express server
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );

  // connect to the mongodb database
  (async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/blogging-platform", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB database successfully");
    } catch (error) {
      console.log(
        "Failed to establish connection with the MongoDB database",
        error
      );
    }
  })();

  app.use(express.json());

  app.use("/", mainRouter);
  app.use("/user", userRouter);
  app.use("/post", blogPostRouter);
  app.use("/comment", commentRouter);

  app.listen(parseInt(5000), () => {
    console.log(`blogging-platform API running at ${os.hostname} at port 5000`);
  });
};

main().catch((error) => {
  console.log(error);
});
