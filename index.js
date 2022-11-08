const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ObjectID,
} = require("mongodb");
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
    /* ------------Create service database with service collection---------- */
    const serviceCollection = client
      .db("ucritique-reviews")
      .collection("services");

    /* ------Review Collection--------- */
    const reviewCollection = client
      .db("ucritique-reviews")
      .collection("reviews");
    /* ------------------------------Services----------------------------------- */
    /* ------------Add a service (private)---------- */
    app.post("/service", verifyJWT, async (req, res) => {
      //further email verification
      if (req.decoded.email !== req.query.email) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      //Let user create service if user is verified
      const service = req.body;
      const result = await serviceCollection.insertOne(service);

      res.json({ message: "success", result });
    });
    /* ------------Add a service end---------- */

    /* -----------Get all the services---------- */
    app.get("/services", async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);

      const query = {};
      const cursor = serviceCollection.find(query);

      //pagination if query exist
      const result = await cursor
        .skip(size * page)
        .limit(size)
        .toArray();
      const dataCount = await serviceCollection.estimatedDocumentCount();

      res.json({ dataCount, result });
    });
    /* -----------Get all the services end---------- */

    /* -----------Get a service---------- */
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await serviceCollection.findOne(query);

      res.json({ message: "success", result });
    });
    /* -----------Get a service end---------- */
    /* ------------------------------Services end----------------------------------- */

    /* ------------------------------Reviews----------------------------------- */
    /* ------Add review by specific service (private)---------- */
    app.post("/reviews", verifyJWT, async (req, res) => {
      //further email verification
      if (req.decoded.email !== req.query.email) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      //Let user add a review if user is verified
      const review = req.body;
      const doc = {
        ...review,
        dateAdded: new Date(),
      };
      const result = await reviewCollection.insertOne(doc);

      res.json({ message: "success", result });
    });
    /* ------Add review by specific service (private) end---------- */

    /* ------Get reviews by specific service ---------- */
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      //Filter reviews by service id
      const query = { serviceId: id };
      const options = {
        sort: { dateAdded: -1 },
      };
      const cursor = reviewCollection.find(query, options);

      const result = await cursor.toArray();

      res.json({ message: "success", result });
    });
    /* ------Get reviews by specific service end---------- */

    /* ------Get reviews by specific user (private)---------- */
    app.get("/myreviews", verifyJWT, async (req, res) => {
      //email verification
      if (req.decoded.email !== req.query.email) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      //Filter reviews by service id
      const query = { author_email: req.query.email };

      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();

      res.json({ message: "success", result });
    });
    /* ------Get reviews by specific user end---------- */

    /* ------Delete a review (protected) ---------- */
    app.delete("/reviews/:id", verifyJWT, async (req, res) => {
      if (req.query.email !== req.decoded.email) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const query = { _id: ObjectId(req.params.id) };

      const result = await reviewCollection.deleteOne(query);

      res.json({ message: "success", result });
    });
    /* ------Delete a review (protected) ---------- */

    /* ------Update a review (protected) ---------- */
    app.patch("/reviews/:id", verifyJWT, async (req, res) => {
      if (req.query.email !== req.decoded.email) {
        res.status(401).json({ message: "Unauthorized access" });
      }
      const filter = { _id: ObjectId(req.params.id) };

      const { review, rating } = req.body;
      const updateDoc = {
        $set: {
          review: review,
          rating: rating,
        },
      };

      const result = await reviewCollection.updateOne(filter, updateDoc);

      res.status(401).json({ message: "success", result });
    });
    /* ------Update a review (protected) end---------- */
    /* ------------------------------Reviews end----------------------------------- */
  } finally {
  }
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
