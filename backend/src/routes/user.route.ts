
import express from 'express';
import UserController from '../controllers/user.js';

const app = express();

app.post("/me", UserController.me);

export default app;

