const express = require("express");
const passport = require("passport");
const passportJWT = require("./config/passport");
const port = 3000;

require("./config/mongoose").connect();

const app = express();
app.use(express.urlencoded());
app.use(passport.initialize());
app.use("/", require("./routes"));

app.get("/", (req, res) => {
  res.send(
    '<div style = "font-family: cascadia code;display: flex; flex-direction:column; gap:2rem;align-items:center; justify-content:center; color:black; padding: 30px"><h1 style="font-size: 3rem">  RECOVERO REST API </h1><a href="https://documenter.getpostman.com/view/13538669/2s9YJW4QZK" style = "background: orangered; padding: 10px 20px; color:white; text-decoration:none; font-size:1rem; cursor:pointer; border-radius:10px" href="/api-docs"><p style="font-size: 2rem; margin:0">Documentation 📄</p></div>'
  );
});

app.listen(port, () => {
  console.log(`Successfully Listening on Port ${port}`);
});
