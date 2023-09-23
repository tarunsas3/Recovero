const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      text: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      tags: {
        type: String,
        required: true,
      },
    },
    author: {
      type: ObjectId,
      ref: "User",
    },
    comments: [{ type: ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const Post = (module.exports = mongoose.model("Post", postSchema));
