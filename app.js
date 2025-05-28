const express = require("express");
const dbConnect = require("./db/db");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const orgRoutes = require("./routes/org.routes");
const orgTypeRoutes = require("./routes/org.type.routes");
const orgMappingToUsers = require("./routes/org.user.mapping.routes");
const branchRoutes = require('./routes/branch.routes');
const roleRoutes = require('./routes/role.routes');
const rightRoutes = require("./routes/rights.routes");
const standardSettingRoutes = require("./routes/standard.setting.routes");
const resourceRoutes = require("./routes/resource.routes");
const resourceTypeRoutes = require("./routes/resource.type.routes");
const resourceSpecTypeRoutes = require("./routes/resource.specification.type.routes");
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
app.use("/api/v1/org", orgRoutes);
app.use("/api/v1/org-mapping-to-user", orgMappingToUsers);
app.use("/api/v1/org-type", orgTypeRoutes);
app.use('/api/v1/branch', branchRoutes);
app.use('/api/v1/role', roleRoutes);
app.use("/api/v1/rights", rightRoutes);
app.use("/api/v1/standard-settings", standardSettingRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/resource-types", resourceTypeRoutes);
app.use("/api/v1/resource-spec-types", resourceSpecTypeRoutes);



// 6️ Global error handler (should be last)
app.use(errorHandler);

//Ready to export
module.exports = app;
