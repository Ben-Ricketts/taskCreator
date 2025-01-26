const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// Config dotenv
dotenv.config({ path: "./backend/config.env" });

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace("<db_password>", process.env.DBPASS);

mongoose.connect(DB)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.error("DB CONNECTION ERROR:", err.message);
  });

// Add error handler for the server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err.message);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
