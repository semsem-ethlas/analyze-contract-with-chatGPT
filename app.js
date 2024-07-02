import express from "express";
import { auditSmartContract } from "./auditService.js";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Convert __dirname to work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON bodies
app.use(express.json());

// Serve the index.html file at the root endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/audit", async (req, res) => {
  const { contractAddress } = req.body;
  try {
    const analysis = await auditSmartContract(contractAddress);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  // Open the default web browser to http://localhost:3000
  await open(`http://localhost:${port}`);
});
