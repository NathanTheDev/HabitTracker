
import express from 'express';
import { AuthController } from '../controllers/auth.js';

const app = express();
const authController = new AuthController();

app.post("/authenticate", authController.authenticate);

export default app;
