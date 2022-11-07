const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();

/*---------------------
    MiddleWare
    1: Cors
    2: Body parser
-----------------------*/
app.use(cors());
app.use(express.json());

/* --------Middleware end-------- */

/* --------------root route------------ */

app.get("/", (req, res) => {
  console.log(req.method);
  res.json({ message: "Success", data: "Server is running" });
});
/* --------------root route end------------ */

/* ------------Database Connection---------- */
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.mj0nqa8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.listen(port, () => {
  client.connect((err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("DB connected");
    }
  });

  console.log("App is running on port: ", port);
});
