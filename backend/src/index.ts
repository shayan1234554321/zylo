import dotenv from "dotenv";
dotenv.config();

import socketModel from "./model/rideSocket.js";
import "./library/mongoDB.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import http from "http";
import { handleSocketRide } from "./library/socket.js";

// Initializations
const app: express.Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 4500;
const __dirname: string = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "/assets")));

// Logging middleware

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Handle Sockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle connections for the Ride namespace
await socketModel.deleteMany({});
const rideNamespace = io.of("/ride");
rideNamespace.on("connection", async (socket) => {
  handleSocketRide(socket);
});

// Global states
global.rideNamespace = rideNamespace;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
