import cors from "cors";
// dotenv.config();
import express from "express"; // express js
import mongoose from "mongoose";
import morgan from "morgan";

// routes
import routers from "./src/routers/index.js";
import expressListRoutes from "express-list-routes";

const app = express();

const { APP_PORT } = process.env;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://niyocf-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(express.json()); // body json
app.use(express.urlencoded({ extended: false })); // form-urlencoded

app.use(routers);
// using public folders
app.use(express.static("public"));

// start server with mongoose (mongodb module)
expressListRoutes(app);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    }
  )
  .then(() => {
    console.log("Mongo DB Connected");
    app.listen(APP_PORT, () => {
      console.log(`Server is running at port ${APP_PORT}`);
    });
  })
  .catch((err) => console.log(err));

export default app;
