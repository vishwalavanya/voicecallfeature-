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

app.get("/token/:username", (req, res) => {
  try {
    const username = req.params.username;

    const token = tokenGenerate(
      process.env.APPLICATION_ID,
      process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
      {
        sub: username,
        exp: Math.round(Date.now() / 1000) + 3600, // 1 hour expiry

        // ✅ Correct minimal WebRTC ACL for Vonage Client SDK
        acl: {
          paths: {
            "/v1/users/**": {},
            "/v1/sessions/**": {},
            "/v1/devices/**": {},
            "/v1/rtc/**": {}
          }
        }
      }
    );

    res.json({ username, token });

  } catch (error) {
    console.error("Token Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () =>
  console.log("✅ WebRTC Token Server running on port 3000 ✅")
);

