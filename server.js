import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import dataRoute from "./routes/data.js";
import morgan from "morgan";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    Credential: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoute);
app.use("/api/data", dataRoute);

// database connection
mongoose.set("strictQuery", false);

app.get("/", (req, res) => {
  res.send("Hello, this is the backend server!");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database is connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

app.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}`);
});
