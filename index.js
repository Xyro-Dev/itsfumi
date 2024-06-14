const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const fetch = require("node-fetch");
const fs = require("fs");
const formData = require("form-data");
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windows: 1 * 60 * 1000, // 15 menit
  max: 25, // 5 req max
  message: "To Many Request From This Ip, What Are You Doing?",
});

const app = express();
const PORT = process.env.PORT || 3000;
const creator = "IFTXH";
app.enable("trust proxy");
app.set("json spaces", 2);

// Middleware untuk CORS
app.use(cors());
app.use(limiter);

// FUNGSI ---

// -------------------------------------------------------//

// Endpoint untuk servis dokumen HTML
// app.get('/docs', (req, res) => {
//  res.sendFile(path.join(__dirname, 'index.html'));
// });



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // dash html
});
app.get("/anime", (req, res) => {
  res.sendFile(path.join(__dirname, "animepict.html")); // dash html
});


// endpoint 


// Cek EndPoint
app.get('/endpoints', (req, res) => {
  const apiFilePath = path.join(__dirname, './index.js');

  // Membaca file index.js yang berisi definisi endpoint-endpoint
  fs.readFile(apiFilePath, 'utf8', (err, apiCode) => {
      if (err) {
          console.error('Gagal membaca file index.js:', err);
          return res.status(500).json({ error: 'Gagal Mengambil Data Endpoints' });
      }

      try {
          const endpoints = [];
          const routerRegex = /app\.get\(['"]\/api\/(\w+)['"],\s*async\s*\(req,\s*res\)\s*=>\s*{([\s\S]*?)\s*}/g;

          let match;
          while ((match = routerRegex.exec(apiCode)) !== null) {
              const endpoint = match[1];
              const endpointCode = match[2];

              const paramRegex = /req\.query\.(\w+)/g;
              const parameters = [];
              let paramMatch;

              while ((paramMatch = paramRegex.exec(endpointCode)) !== null) {
                  const paramName = paramMatch[1];
                  parameters.push(paramName);
              }

              parameters.push("apikey");
              const link = `http://localhost:3000/api/${endpoint}?${parameters.map(param => `${param}=`).join('&')}`;

              endpoints.push({
                  name_endpoint: endpoint,
                  link: link
              });
          }

          res.json({ endpoints });
      } catch (error) {
          console.error('Gagal mengekstrak endpoint:', error);
          res.status(500).json({ error: 'Gagal mengekstrak endpoint' });
      }
  });
});

// Handle 404 error
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Handle error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
