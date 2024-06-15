const express = require('express');
const path = require('path')

const app = express();



app.use = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/playground", (req, res) => {
  res.sendFile(path.join(__dirname, "animepict.html")); 
});

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "upload.html")); 
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
