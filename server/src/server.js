const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const calibrationRoutes = require("./routes/calibrationRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const companiesRoutes = require("./routes/companiesRoutes");
const cors = require("cors"); // Import cors middleware

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// Add CORS Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from React frontend running on port 3000
  })
);

// Product routes
app.use("/api/products", productRoutes);
app.use("/api/calibration", calibrationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/company", companiesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
