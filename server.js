import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Auth } from '@vonage/server-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const vonageAuth = new Auth({
  applicationId: process.env.APPLICATION_ID,
  privateKey: process.env.PRIVATE_KEY_PATH
});

// ✅ Generate JWT for users
app.get('/auth/:user', async (req, res) => {
  const user = req.params.user;

  if (!["vishwa", "ammu"].includes(user)) {
    return res.status(400).json({ error: "Invalid user" });
  }

  const token = vonageAuth.generateJwt({
    sub: user,
  });

  res.json({ token });
});

// ✅ Test route
app.get('/', (req, res) => {
  res.send("Vishwa-Ammu Voice Call Backend Working ✅");
});

// ✅ Deploy port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
