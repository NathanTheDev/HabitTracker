
import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { extractToken } from './util.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/auth", authRoutes);

app.use(extractToken);

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

