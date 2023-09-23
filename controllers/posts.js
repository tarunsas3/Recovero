const Post = require("../models/post");
const User = require("../models/user");

module.exports.create = async (req, res) => {
  try {
    let post = await Post.findOne({ title: req.body.title });
    if (!post) {
      const user = req.user;
      req.body.author = user._id;
      let post = await Post.create(req.body);
      await User.findByIdAndUpdate(user._id, { $push: { posts: post._id } });

      return res.status(200).json({
        message: "Post Created Successfully",
        postId: post._id,
        title: post.title,
        author: post.author,
      });
    } else {
      return res.status(402).json({
        message: "Internal Server Error: Post already created",
        postId: post._id,
        title: post.title,
        author: post.author,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.view = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("author", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.update = async (req, res) => {
  try {
    const postId = req.params.postId;
    const updatedData = req.body;
    const user = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.author) !== String(user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    post.title = updatedData.title;
    post.content = updatedData.content;
    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      postId: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = req.user;

    const post = await Post.findById(postId).populate("author", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.author._id) !== String(user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Post.findByIdAndRemove(postId);

    await User.findByIdAndUpdate(user._id, { $pull: { posts: postId } });

    return res.status(200).json({
      message: "Post deleted successfully",
      postId: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.viewUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userPosts = await Post.find({ author: userId });

    if (!userPosts || userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    return res.status(200).json({ posts: userPosts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.viewAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
