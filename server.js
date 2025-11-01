import express from "express";
import { Vonage } from "@vonage/server-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const vonage = new Vonage({
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
});

app.get("/", (req, res) => {
  res.send("✅ Voice Call Backend Running Successfully!");
});

// Generate JWT Token for Users
app.get("/token/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const token = vonage.jwt.sign({
      sub: username,
      acl: {
        paths: {
          "/*/users/**": {},
          "/*/conversations/**": {},
          "/*/sessions/**": {},
          "/*/devices/**": {},
          "/*/image/**": {},
          "/*/media/**": {},
          "/*/applications/**": {},
          "/*/push/**": {},
          "/*/knocking/**": {}
        }
      }
    });

    res.json({
      username,
      token
    });
  } catch (error) {
    console.error("Token Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));




