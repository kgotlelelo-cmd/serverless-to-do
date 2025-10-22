const { getUserController, createUserController } = require('./user.controller');
const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.get("/user/:email", getUserController);
app.post("/user", createUserController);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
