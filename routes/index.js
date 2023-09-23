const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../controllers/users");
const Post = require("../controllers/posts");
const Comment = require("../controllers/comments");

router.post("/users/register", User.register);
router.post("/users/login", User.login);

router.post(
  "/posts/create",
  passport.authenticate("jwt", { session: false }),
  Post.create
);
router.get(
  "/posts/view/:postId",
  passport.authenticate("jwt", { session: false }),
  Post.view
);
router.put(
  "/posts/update/:postId",
  passport.authenticate("jwt", { session: false }),
  Post.update
);
router.delete(
  "/posts/delete/:postId",
  passport.authenticate("jwt", { session: false }),
  Post.delete
);
router.get(
  "/posts/:userId",
  passport.authenticate("jwt", { session: false }),
  Post.viewUserPosts
);
router.get(
  "/feed",
  passport.authenticate("jwt", { session: false }),
  Post.viewAllPosts
);

router.post(
  "/posts/:postId/addComment",
  passport.authenticate("jwt", { session: false }),
  Comment.create
);
router.get(
  "/posts/:postId/view/:commentId",
  passport.authenticate("jwt", { session: false }),
  Comment.view
);
router.put(
  "/posts/:postId/update/:commentId",
  passport.authenticate("jwt", { session: false }),
  Comment.update
);
router.delete(
  "/posts/:postId/delete/:commentId",
  passport.authenticate("jwt", { session: false }),
  Comment.delete
);
router.get(
  "/posts/:userId/comments",
  passport.authenticate("jwt", { session: false }),
  Comment.viewUserComments
);
router.get(
  "/posts/:postId/feed",
  passport.authenticate("jwt", { session: false }),
  Comment.viewAllComments
);

module.exports = router;
