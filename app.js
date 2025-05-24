const express = require("express");
const dbConnect = require("./db/db");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const userRoutes = require("./routes/admin.routes");
const orgRoutes = require("./routes/org.routes");
const cookieParser = require("cookie-parser");

// 1️ Connect to MongoDB
dbConnect();

// 2️ Middleware to parse cookies
app.use(cookieParser());

// 3️ CORS configuration (allow frontend & send cookies)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 4️ Middleware to parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5️  routes mounting
app.use("/api/v1/user", userRoutes);
app.use('/api/v1/org', orgRoutes);
// 6️ Global error handler (should be last)
app.use(errorHandler);

//Ready to export
module.exports = app;
