const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(
      "mongodb+srv://Tarun:Iy5jnImwsLcSE8uy@cluster0.zgt341c.mongodb.net/data"
    )
    .then(console.log("successfully connected to MongoDB"))
    .catch((err) => {
      console.log("Failed to connect to MongoDB", err);
    });
};
