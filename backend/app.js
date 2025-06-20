const express = require("express");
const {limiter} = require("./utils/rateLimiter")
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/disasters", require("./routes/disasterRoutes"));
app.use("/api/geocode/", require("./routes/geocodingRoutes"));
app.use("/api/geocode_location/", require("./routes/geocodingRoutes"));
module.exports = app;