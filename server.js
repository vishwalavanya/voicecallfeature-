import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Auth } from '@vonage/server-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Vonage Authentication using Private Key ONLY
const vonageAuth = new Auth({
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY_PATH
});

// ✅ Generate JWT token for Vishwa or Ammu
app.get('/auth/:user', (req, res) => {
  const user = req.params.user;

  if (!["vishwa", "ammu"].includes(user)) {
    return res.status(400).json({ error: "Invalid user" });
  }

  try {
    const token = vonageAuth.generateJwt({
      sub: user, // ✅ Identity for WebRTC app
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) // 2 hours
    });

    res.json({ token });
  } catch (err) {
    console.error("JWT error:", err);
    res.status(500).json({ error: "Failed to generate JWT" });
  }
});

// ✅ Test Route
app.get('/', (req, res) => {
  res.send("✅ Vishwa-Ammu Backend is Running");
});

// ✅ Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
