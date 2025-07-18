require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const allowedOrigins = [
  "https://v0-logsheet-management-design.vercel.app",
  "https://v0-logsheet-management-system-desig.vercel.app",
  "https://preview-logsheet-management-system-design-kzmo3uz2f41m0qji8v2d.vusercontent.net",
  "https://v0-logsheet-management-system-desi-one.vercel.app",
  "https://v0-logsheet-management-syste-rohit-choudharys-projects-1e246c86.vercel.app",
  // add more origins here if needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/logsheet", require("./routes/logsheet"));
app.use("/api/admin", require("./routes/admin"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
