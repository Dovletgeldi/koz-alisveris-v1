const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/config", (req, res) => {
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath);

  const config = {
    googleSheetApi: process.env.GOOGLE_SHEET_API,
  };
  res.json(config);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
