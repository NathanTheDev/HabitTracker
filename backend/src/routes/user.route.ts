
import express from 'express';
import UserController from '../controllers/user.js';
import Session from 'supertokens-node/lib/build/recipe/session/sessionClass';
import { requireAuth } from '../middleware/auth.js';

const app = express();

app.get("/me", requireAuth, UserController.me);

export default app;

