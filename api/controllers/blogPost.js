import User from "../models/User.js";
import BlogPost from "../models/BlogPost.js";

export const createPost = async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const categories = req.body.categories;
  const username = req.body.username;

  const user = await User.find({ username }).exec();
  console.log("user: ", user);
  if (user.length === 0) {
    return res.status(406).json({
      message: "User not found",
    });
  }

  if (!title | !content | !categories) {
    return res.status(406).json({
      message: "Need to provide more fields.",
    });
  }

  const newPost = new BlogPost({
    title,
    content,
    categories,
    createdAt: new Date(),
    author: user[0]._id,
  });

  let result;

  try {
    result = await newPost.save();
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json(result);
};

export const updatePost = async (req, res) => {
  const { title, content, categories, postId, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(406).json({
      message: "User does not exist",
    });
  }

  const post = await BlogPost.findById(postId);
  if (!post) {
    return res.status(406).json({
      message: "Post does not exist",
    });
  }

  if (post.author[0].toString() !== user._id.toString()) {
    return res.status(406).json({
      message: "Only the author can update this post",
    });
  }

  const filter = { _id: postId };
  const update = { title, content, categories };
  let result;
  try {
    result = await BlogPost.findOneAndUpdate(filter, update);
  } catch (error) {
    return res.status(406).json({
      message: "Update failed",
    });
  }

  return res.status(201).json({ status: true });
};

export const deletePost = async (req, res) => {
  const { postId, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(406).json({
      message: "User does not exist",
    });
  }

  const post = await BlogPost.findById(postId);
  if (!post) {
    return res.status(406).json({
      message: "Post does not exist",
    });
  }

  if (post.author[0].toString() !== user._id.toString()) {
    return res.status(406).json({
      message: "Only the author can delete a post",
    });
  }

  try {
    await BlogPost.findByIdAndDelete(postId);
  } catch (error) {
    return res.status(406).json({
      message: "Deletion failed",
    });
  }

  return res.status(201).json({
    status: true,
  });
};
