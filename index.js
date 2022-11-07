const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
const verifyJWT = require("./middleware/verifyJWT");

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
/* 



*/
/* --------------root route------------ */
app.get("/", (req, res) => {
  console.log(req.method);
  res.json({ message: "Success", data: "Server is running" });
});
/* --------------root route end------------ */
/* 



*/
/* ------------Generate JWT token for logged in user---------- */
app.post("/jwt", (req, res) => {
  const cryptoToken = process.env.ACCESS_TOKEN;
  const user = req.body;
  const token = jwt.sign(user, cryptoToken, { expiresIn: "1d" });

  res.json({ token: token });
});
/* ------------Generate JSON web token end---------- */
/* 




*/
/* ------------Database---------- */

/* ------------Database connect---------- */
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.mj0nqa8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
/* ------------Database connect end---------- */
/* 



*/
/* ------------Database Operation---------- */
const run = async () => {
  try {
    /* ------------Create database with collection---------- */
    const serviceCollection = client
      .db("ucritique-reviews")
      .collection("services");

    /* ------------Add a service---------- */
    app.post("/service", verifyJWT, async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);

      res.json({ message: "success", result });
    });
    /* ------------Add a service end---------- */
  } catch {}
};

run().catch(console.dir);
/* ------------Database Operation end---------- */
/* ------------Database---------- */

/* ------------Server ---------- */
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
