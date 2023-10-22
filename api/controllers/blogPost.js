import User from "../models/User.js";
import BlogPost from "../models/BlogPost.js";
import { BSON, ObjectId } from "bson";

export const post = async (req, res) => {
  const { postId } = req.body;

  const post = await BlogPost.findById(postId)
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  return res.status(201).json(post);
};

export const posts = async (req, res) => {
  const { filter } = req.body;
  let blogPosts;
  if (!filter) {
    blogPosts = await BlogPost.find()
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .populate("author");
  }

  blogPosts = await BlogPost.find({
    categories: filter,
  })
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  return res.status(201).json(blogPosts);
};

export const createPost = async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const categories = req.body.categories;
  const userId = req.body.userId;

  const user = await User.findById(userId);
  console.log("user: ", user);
  if (!user) {
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
    author: user._id,
  });

  user.blogPosts.push(newPost);
  let result;

  try {
    result = await newPost.save();
    await user.save();
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

  let blogPosts = [...user.blogPosts];
  const pid = new BSON.ObjectId(postId);

  blogPosts = blogPosts.filter((id) => !id.equals(pid));

  user.blogPosts = blogPosts;

  try {
    await BlogPost.findByIdAndDelete(postId);
    await user.save();
  } catch (error) {
    return res.status(406).json({
      message: "Deletion failed",
    });
  }

  return res.status(201).json({
    status: true,
  });
};
