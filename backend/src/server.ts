import "dotenv/config";
import express from "express";
import cors from "cors";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import { initSuperTokens } from "./auth/supertokens.js";
import userRouter from "./routes/user.route.js";
import { getAllCORSHeaders } from "supertokens-node";

initSuperTokens();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ["content-type", ...getAllCORSHeaders()],
    credentials: true,
  })
);

app.use(express.json());

app.use(middleware());

app.use("/user", userRouter);

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

// Must be last
app.use(errorHandler());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
