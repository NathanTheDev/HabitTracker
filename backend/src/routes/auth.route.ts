
import express from 'express';
import AuthController from '../controllers/auth.js';

const app = express();

app.post("/authenticate", AuthController.authenticate);

app.post("/magic", AuthController.magicCallback);

export default app;
