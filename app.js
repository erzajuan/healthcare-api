require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conncet to Database
const connectDB = require("./config/db");
connectDB();

// Routes
const routes = require("./routes");
app.use("/api/v1", routes);

// Serve static file
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/sounds", express.static("uploads/sounds"));

// Error handler
const { errorHandler, noPageFound } = require("./middlewares/errorHandler");

// 404 handler
app.use(noPageFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
