import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Connection } from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true, // Allow requests from this origin
    methods: ["GET", "POST"],
  },
});
const PORT = 3000;

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const URL = `mongodb+srv://${username}:${password}@cluster0.xwisexr.mongodb.net/?retryWrites=true&w=majority`;
Connection(username, password);

console.log(URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "asdfefna",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
      httpOnly: true,
      secure: false, // For development; set to true in production (requires HTTPS)
    },
  })
);

// To initialize CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

import Routes from "./routes/routes.js";
app.use("/", Routes);
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Check if the user already exists before adding them
  if (!activeUsers.has(socket.id)) {
    io.emit("userJoined", {
      id: socket.id,
      name: `User${socket.id.slice(0, 5)}`,
      userId: "",
      isLive: true,
    });

    activeUsers.set(socket.id, {
      name: `User${socket.id.slice(0, 5)}`,
      isLive: true,
    });
  }

  // Listen for a "setName" event to update the user's actual name
  socket.on("setName_Id", (name, userId) => {
    console.log(`User ${socket.id} set name to ${name}`);

    // Update the user's name in the activeUsers map
    activeUsers.set(socket.id, {
      name,
      userId,
      isLive: true,
    });

    // Emit event to inform all clients about the updated user information
    io.emit("userUpdated", {
      id: socket.id,
      name,
      userId,
      isLive: true,
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit("userLeft", socket.id);
    activeUsers.delete(socket.id);
  });
});

app.get("/active-users", (req, res) => {
  console.log(req.session.userData);
  const usersArray = Array.from(activeUsers.values());
  console.log("Live Users: ", usersArray);
  res.json(usersArray);
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
