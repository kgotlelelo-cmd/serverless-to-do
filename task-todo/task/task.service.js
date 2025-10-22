const { v4: uuidv4 } = require('uuid');
const { docClient } = require("../database/database.client");
const {
    PutCommand,
    QueryCommand,
    GetCommand,
    DeleteCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;

const getTaskService = async (taskId, userId) => {
    const params = {
        TableName: TASKS_TABLE,
        Key: { taskId, userId }
    }

    const command = new GetCommand(params);
    const response = await docClient.send(command);
    if (!response.Item) {
        return null;
    }
    return response.Item;
}

const createTaskService = async (userId, title, description) => {
    const taskId = uuidv4();

    const params = {
        TableName: TASKS_TABLE,
        Item: { taskId, userId, title, description }
    }

    const command = new PutCommand(params);
    await docClient.send(command);
    return {
        taskId,
        userId,
        title,
        description
    };
}

const getTasksByUserService = async (userId) => {
    const params = {
        TableName: TASKS_TABLE,
        IndexName: 'userIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }

    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    return response.Items;
}


const deleteTaskService = async (taskId, userId) => {
    const params = {
        TableName: TASKS_TABLE,
        Key: { taskId, userId }
    }

    const command = new DeleteCommand(params);
    await docClient.send(command);
    return { taskId, userId };
}

const editTaskService = async (taskId, userId, title, description) => {

    const updateExpressions = [];
    const expressionAttributeValues = {};

    if (title) {
        updateExpressions.push('title = :title');
        expressionAttributeValues[':title'] = title;
    }
    if (description) {
        updateExpressions.push('description = :description');
        expressionAttributeValues[':description'] = description;
    }

    if (updateExpressions.length === 0) {
        throw new Error('No valid fields provided for update');
    }

    const params = {
        TableName: TASKS_TABLE,
        Key: { taskId, userId },
        UpdateExpression: 'SET ' + updateExpressions.join(', '),
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    return response.Attributes;
};

module.exports = {
    getTaskService,
    createTaskService,
    getTasksByUserService,
    deleteTaskService,
    editTaskService
};