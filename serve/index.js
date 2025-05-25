import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import routers from "../../src/routers/index.js"; // adjust path if needed

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://niyocf-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routers);
app.use(express.static("public"));

let isConnected = false; // prevent multiple connections

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await mongoose.connect(
        `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 10000,
        }
      );
      isConnected = true;
      console.log("MongoDB connected.");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      return res.status(500).send("Database connection error.");
    }
  }

  return app(req, res); // this lets Express handle the request
};

export default handler;
