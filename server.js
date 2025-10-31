import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Vonage } from '@vonage/server-sdk';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Vonage Authentication using Private Key
const vonage = new Vonage({
  applicationId: process.env.APPLICATION_ID,
  privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH)
});

// ✅ Generate JWT for Vishwa or Ammu
app.get('/auth/:user', (req, res) => {
  const user = req.params.user;

  if (!["vishwa", "ammu"].includes(user)) {
    return res.status(400).json({ error: "Invalid user" });
  }

  try {
    const token = vonage.generateJwt({
      sub: user,
      exp: Math.floor(Date.now() / 1000) + 7200 // 2 hours
    });
    res.json({ token });
  } catch (error) {
    console.error("JWT generation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Basic Test Route
app.get('/', (req, res) => {
  res.send("✅ Vishwa-Ammu Backend Running");
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

