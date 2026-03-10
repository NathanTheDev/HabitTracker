
import express from 'express';
import UserController from '../controllers/user.js';
import Session from 'supertokens-node/lib/build/recipe/session/sessionClass';

const app = express();

app.get("/me", Session.verifySession(), UserController.me);

export default app;

