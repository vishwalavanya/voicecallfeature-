import express from "express";
import { tokenGenerate } from "@vonage/jwt";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Voice Call Backend Running Successfully!");
});

app.get("/token/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");

    const token = tokenGenerate(
      process.env.APPLICATION_ID,
      privateKey,
      {
        sub: username,
        exp: Math.round(Date.now() / 1000) + 3600, // 1 hour

        // ✅ Correct ACL Permissions for Vonage WebRTC Voice Calls
        acl: {
          paths: {
            "/v1/users/**": {},
            "/v1/conversations/**": {},
            "/v1/sessions/**": {},
            "/v1/devices/**": {},
            "/v1/media/**": {},
            "/v1/knocking/**": {},
            "/v1/applications/**": {},
            "/v1/calls/**": {},
            "/v1/rtc/**": {}
          }
        }
      }
    );

    return res.json({ username, token });

  } catch (error) {
    console.error("Token Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () =>
  console.log("✅ Server running on port 3000 — JWT Ready ✅")
);
