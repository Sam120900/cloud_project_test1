const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const preprocessFile = require("./preprocess");
const trainModel = require("./trainModel");
const Papa = require("papaparse");

const app = express();
const upload = multer({ dest: "uploads/" }); // storing files in an 'uploads' directory

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// If you want to specifically handle the root URL:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // Call your preprocessing function
  preprocessFile(file.path)
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/train", upload.single("file"), async (req, res) => {
  try {
    // ... rest of your code ...
    console.log("POST /train received");
    // Read the uploaded file
    const filePath = path.join(__dirname, req.file.path);
    const data = fs.readFileSync(filePath, "utf8");

    // Parse CSV string into an array of objects
    const parsedData = Papa.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // parsedData.data is now an array of objects representing your CSV data
    const model = await trainModel(parsedData.data);

    res.send("Model trained successfully");
    // ... rest of your code ...
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
