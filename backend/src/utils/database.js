const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const dynamoDb = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000", // ⚠️ ใช้กับ DynamoDB Local
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

module.exports = dynamoDb;
