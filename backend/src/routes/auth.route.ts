
import express from 'express';
import AuthController from '../controllers/auth.js';

const app = express();

app.post("/authenticate", AuthController.authenticate);

export default app;
