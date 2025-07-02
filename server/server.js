require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const port = process.env.PORT;

app.use(express.json());
connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/logsheet", require("./routes/logsheet"));
app.use("/api/admin", require("./routes/admin"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
