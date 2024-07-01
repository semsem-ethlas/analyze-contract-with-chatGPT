import express from "express";
import bodyParser from "body-parser";
import { auditSmartContract } from "./auditService.js";
import open from "open";

const app = express();
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS) from the public directory
app.use(express.static("public"));

// Define the /audit POST endpoint
app.post("/audit", async (req, res) => {
  const { address } = req.body;
  console.log(`Received audit request for address: ${address}`);
  try {
    const vulnerabilities = await auditSmartContract(address);
    console.log(`Audit successful for address: ${address}`);
    res.json({ vulnerabilities });
  } catch (error) {
    console.error(`Error auditing address ${address}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await open(`http://localhost:${PORT}`);
});
