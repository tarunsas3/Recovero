const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = req.user;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = new Comment({
      author: user._id,
      post: postId,
      comment: req.body.comment,
    });
    const savedComment = await newComment.save();
    post.comments.push(savedComment._id);
    await post.save();
    return res.status(200).json({
      message: "Comment Created Successfully",
      commentId: savedComment._id,
      commentText: savedComment.comment,
      author: user._id,
      post: postId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.view = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId).populate(
      "author",
      "username"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(200).json({ comment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.update = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const user = req.user;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (String(comment.author) !== String(user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    comment.comment = req.body.comment;
    await comment.save();
    return res.status(200).json({
      message: "Comment updated successfully",
      commentId: comment._id,
      commentText: comment.comment,
      author: comment.author,
      post: comment.post,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const user = req.user;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (String(comment.author) !== String(user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }
    const postId = comment.post;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.pull(commentId);
    await post.save();
    await Comment.deleteOne({ _id: comment._id });

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentId: comment._id,
      commentText: comment.comment,
      author: comment.author,
      post: comment.post,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.viewUserComments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const comments = await Comment.find({ author: userId }).populate("post");

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this user" });
    }

    return res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.viewAllComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId });

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this post" });
    }

    return res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
