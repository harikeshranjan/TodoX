import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users";
import taskRoutes from "./routes/tasks";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000/", process.env.CLIENT_URL as string],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


mongoose.connect(process.env.MONGODB_URI as string, { dbName: "TodoX" })
  .then(() => console.log("[db]: Connected to database"))
  .catch((err) => console.log("[db]: Database connection failed", err));

app.use("/user", userRoutes);
app.use("/task", taskRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});