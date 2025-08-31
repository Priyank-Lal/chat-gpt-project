const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
