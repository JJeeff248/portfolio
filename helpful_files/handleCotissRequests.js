import {
    DynamoDBClient,
    ScanCommand,
    PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const cotissTable = "cotissFeedback";

export const handler = async (event) => {
    if (event.requestContext.http.method === "GET") {
        return await getFeedback();
    } else if (event.requestContext.http.method === "POST") {
        const { feedback, rating } = JSON.parse(event.body);
        return await postFeedback(feedback, Number(rating));
    } else {
        return {
            statusCode: 404,
            body: "Not found",
        };
    }
};

const getFeedback = async () => {
    const params = {
        TableName: cotissTable,
        Limit: 1,
        ScanIndexForward: false,
    };
    const command = new ScanCommand(params);
    const data = await client.send(command);
    const item = data.Items[0];
    return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(item)),
    };
};

const postFeedback = async (feedback, rating) => {
    const id = Date.now().toString();
    // partition key is id, sort key is rating
    const params = {
        TableName: cotissTable,
        Key: marshall({ id, rating }),
        Item: marshall({ id, rating, feedback }),
        ReturnValues: "NONE",
    };
    console.log(params);
    const command = new PutItemCommand(params);
    await client.send(command);
    return {
        statusCode: 200,
        body: "Success",
    };
};
