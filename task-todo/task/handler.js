const {
    getTaskController,
    createTaskController,
    getTasksByUserController,
    deleteTaskController,
    editTaskController
} = require('./task.controller');


const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.get("/task/:taskId/:userId", getTaskController);
app.post("/task", createTaskController);
app.get("/task/user/:userId", getTasksByUserController);
app.delete("/task/:taskId/:userId", deleteTaskController);
app.put("/task/:taskId/:userId", editTaskController);


app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});
exports.handler = serverless(app);