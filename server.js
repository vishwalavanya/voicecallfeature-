import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Vonage } from '@vonage/server-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Read private key from env instead of file
const vonage = new Vonage({
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
});

// ✅ Generate JWT
app.get('/auth/:user', (req, res) => {
  const user = req.params.user;

  if (!["vishwa", "ammu"].includes(user)) {
    return res.status(400).json({ error: "Invalid user" });
  }

  try {
    const token = vonage.generateJwt({
      sub: user,
      exp: Math.floor(Date.now() / 1000) + 7200
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send("✅ Vishwa-Ammu Backend Running Successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


