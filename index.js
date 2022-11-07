const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

/*
    MiddleWare
    1: Cors
    2: Body parser
*/
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.method);
  res.json({ message: "Success", data: "Server is running" });
});
app.get("/test", (req, res) => {
  console.log(req.method);
  res.json({ message: "Success", data: `Test ${process.env.TEST} recieved` });
});

app.listen(port, () => {
  console.log("App is running on port: ", port);
});
