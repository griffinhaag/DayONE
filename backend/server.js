require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const videoRoutes = require("./routes/videoRoutes");

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/videos", videoRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
