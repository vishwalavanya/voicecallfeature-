import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Auth } from "@vonage/auth";
import { tokenGenerate } from "@vonage/jwt";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Authentication using private key from ENV
const auth = new Auth({
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
});

// ✅ JWT token endpoint
app.get("/auth/:user", (req, res) => {
  const user = req.params.user;

  if (!["vishwa", "ammu"].includes(user)) {
    return res.status(400).json({ error: "Invalid user" });
  }

  try {
    const token = tokenGenerate(
      process.env.APPLICATION_ID,
      process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
      {
        sub: user,           // ✅ Identify Vishwa or Ammu
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) // 2 hrs
      }
    );

    res.json({ token });
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Backend Running: JWT Ready for WebRTC Calls");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



