import Comment from "../models/Comment.js";
import User from "../models/User.js";
import BlogPost from "../models/BlogPost.js";

export const createComment = async (req, res) => {
  const { content, userId, postId } = req.body;

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

  if (!content) {
    return res.status(406).json({
      message: "Your comment cannot be empty",
    });
  }

  const newComment = new Comment({
    content,
    createdAt: new Date(),
    blogPost: post._id,
    author: user._id,
  });

  post.comments.push(newComment);
  let result;

  try {
    result = await newComment.save();
    await post.save();
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json(result);
};

export const deleteComment = async (req, res) => {
  const { userId, commentId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(406).json({
      message: "User does not exist",
    });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(406).json({
      message: "Comment does not exist",
    });
  }

  if (comment.author[0].toString() !== user._id.toString()) {
    return res.status(406).json({
      message: "Only the author can delete a comment",
    });
  }

  try {
    await Comment.findByIdAndDelete(commentId);
  } catch (error) {
    return res.status(406).json({
      message: "Deletion failed",
    });
  }

  return res.status(201).json({
    status: true,
  });
};
