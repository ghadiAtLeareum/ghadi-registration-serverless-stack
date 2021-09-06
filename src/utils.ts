import type { APIGatewayEvent } from "aws-lambda";
import { jsonContentType } from "./schemas";
import { SES, DynamoDB, SNS } from "aws-sdk";
import axios from "axios";

const marshaller = DynamoDB.Converter.unmarshall;
const ses = new SES();
const sns = new SNS();

const dynamoDb = new DynamoDB({ apiVersion: "2012-08-10" });

export const getContentType = (event: APIGatewayEvent) => {
  console.log("Headers are");
  console.log(event.headers);
  return event.headers["Content-Type"] || event.headers["content-type"];
};

export const getPayload = async (event: APIGatewayEvent) => {
  await jsonContentType.validate(getContentType(event));
  console.log("body is");
  console.log(event.body);
  return JSON.parse(event.body);
};

export const sendConfirmationCodeToUserEmail = async (email: string) => {
  const from = "mdallalghadi@gmail.com";
  const token = Math.floor(Math.random() * 900000) + 100000;
  const content = ` This is your Email Confirmation code` + ` ${token}`;
  const params = {
    Destination: {
      ToAddresses: [email], // Email address addresses that you want to send your email to
    },
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: `<html><body><h2>` + `${content}` + `</h2></body></html>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `${token}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Confirmation Email",
      },
    },
    Source: from,
  };

  console.log("this is the ses params: ");
  console.log(params);

  await ses.sendEmail(params).promise();
  await addUserToDynamoDbVerificationTable(token, email);
  return true;
};

export const addUserToDynamoDbVerificationTable = async (
  token: number,
  email: string
) => {
  const timeStamp = Date.now() / 1000;
  const params = {
    Item: {
      email: {
        S: email,
      },
      token: {
        S: JSON.stringify(token),
      },
      veririficationType: {
        S: "EMAIL_VERIFICATION",
      },
      tokenVerificationTimeStamp: {
        N: JSON.stringify(timeStamp),
      },
    },
    TableName: "verification",
  };

  console.log(params);
  await dynamoDb.putItem(params).promise();
};

export const checkConfirmationToken = async (email: string) => {
  const params = {
    TableName: "verification",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": {
        S: email,
      },
    },
  };
  const user = await dynamoDb.query(params).promise();
  user.Items = user.Items.map((item) => {
    return marshaller(item);
  });
  return user.Items[0];
};

export const checkIfUserIsInDynamoDbRegistrationTable = async (
  email: string
) => {
  const params = {
    TableName: "registration",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": {
        S: email,
      },
    },
  };
  const user = await dynamoDb.query(params).promise();
  user.Items = user.Items.map((item) => {
    return marshaller(item);
  });
  if (user.Items.length > 0) return true;
  else return false;
};

export const addUserToRegistrationTable = async (
  email: string,
  firstName: string,
  lastName: string
) => {
  const params = {
    Item: {
      email: {
        S: email,
      },
      firstName: {
        S: firstName,
      },
      lastName: {
        S: lastName,
      },
      createdAt: {
        N: JSON.stringify(Date.now()),
      },
    },
    TableName: "registration",
  };
  await dynamoDb.putItem(params).promise();
};

export const sendSMSVerificationToken = async (
  email: string,
  phoneNumber: string
) => {
  const token = Math.floor(Math.random() * 900000) + 100000;
  // Create publish parameters
  const params = {
    Message: "This is your sms verification token" + token /* required */,
    PhoneNumber: phoneNumber,
  };

  await sns.publish(params).promise();
  await addUserToDynamoDbSMSVerificationTable(token, email);
  return true;
};

export const checkSMSConfirmationToken = async (email: string) => {
  const params = {
    TableName: "verification",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": {
        S: email,
      },
    },
  };
  const user = await dynamoDb.query(params).promise();
  user.Items = user.Items.map((item) => {
    return marshaller(item);
  });
  return user.Items[0];
};

export const addUserToDynamoDbSMSVerificationTable = async (
  token: number,
  email: string
) => {
  const timeStamp = Date.now() / 1000;
  const params = {
    Item: {
      email: {
        S: email,
      },
      token: {
        S: JSON.stringify(token),
      },
      veririficationType: {
        S: "SMS_VERIFICATION",
      },
      tokenVerificationTimeStamp: {
        N: JSON.stringify(timeStamp),
      },
    },
    TableName: "verification",
  };

  console.log(params);
  await dynamoDb.putItem(params).promise();
};

export const checkIfPhoneNumberAndIpIsAccepted = async (
  event: APIGatewayEvent
) => {
  const userIp = event.headers["X-Forwarded-For"].split(",")[0];
  const axiosResponse = await axios.get(
    "http://ip-api.com/json/" + `${userIp}`
  );

  console.log("this is the axios reponse");
  console.log(axiosResponse.data.countryCode);

  const params = {
    TableName: "countries_not_allowed",
    KeyConditionExpression: "countryName =:countryName",
    ExpressionAttributeValues: {
      ":countryName": {
        S: axiosResponse.data.countryCode,
      },
    },
  };
  const countryQueried = await dynamoDb.query(params).promise();

  console.log("this is the countryQueried");
  console.log(countryQueried);

  if (countryQueried.Count > 0) return true;
};
