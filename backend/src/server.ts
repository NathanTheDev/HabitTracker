
import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.route.js";
import "./supertokens.js";
import { middleware } from 'supertokens-node/framework/express';
import { errorHandler } from 'supertokens-node/framework/fastify';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true
}));

app.use(middleware());

app.use("/user", userRoutes);

app.use(errorHandler());

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

