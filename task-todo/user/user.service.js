const { v4: uuidv4 } = require('uuid');
const { docClient } = require("../database/database.client");
const {
    PutCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const USERS_TABLE = process.env.USERS_TABLE;

const getUserService = async (email) => {

    const params = {
        TableName: USERS_TABLE,
        IndexName: 'emailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };

    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    if (response?.Items?.length === 0) {
        return null;
    }
    return response?.Items[0];
}

const createUserService = async (name, email) => {

    const userId = uuidv4();

    const params = {
        TableName: USERS_TABLE,
        Item: { userId, name, email }
    };

    const command = new PutCommand(params);
    await docClient.send(command);

    return {
        userId,
        name,
        email
    };
}


module.exports = {
    getUserService,
    createUserService
};