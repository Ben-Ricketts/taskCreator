const express = require("express");
const taskRouter = require("./routes/taskRoute");
const cors = require("cors");

const app = express();
app.use(cors());

// Moddleware for json
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the ToDo App API");
});
app.use("/api/tasks", taskRouter);

module.exports = app;
