import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import {
  getPayload,
  checkSMSConfirmationToken,
  sendSMSVerificationToken,
  checkIfUserIsInDynamoDbRegistrationTable,
  addUserToRegistrationTable,
  checkIfPhoneNumberAndIpIsAccepted,
} from "../utils";
import { userTokenCheckSchema } from "../schemas";
export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "https://lereum.com",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };
  try {
    const body = await getPayload(event);
    const { email, token, phoneNumber, firstName, lastName } =
      await userTokenCheckSchema.validate(body);

    const result = await checkSMSConfirmationToken(email);

    const userToken = result.token;

    const tokenTimeOut = result.tokenVerificationTimeStamp;

    if (userToken != token) {
      await sendSMSVerificationToken(email, phoneNumber);
      return {
        statusCode: 400,
        body: "Wrong token , please check your phone for the new one",
        headers,
      };
    }

    const now = Date.now() / 1000 - 5 * 60;

    if (tokenTimeOut < now) {
      await sendSMSVerificationToken(email, phoneNumber);
      return {
        statusCode: 400,
        body: "Token Expired , please check your phone for the new one",
        headers,
      };
    }

    const country = await checkIfPhoneNumberAndIpIsAccepted(event);
    if (country) {
      return {
        statusCode: 400,
        body: "Sorry your country is not accepted at the moment",
        headers,
      };
    }

    const userInRegistration = await checkIfUserIsInDynamoDbRegistrationTable(
      email
    );
    if (userInRegistration) {
      return {
        statusCode: 400,
        body: "User Already Registered",
        headers,
      };
    } else {
      await addUserToRegistrationTable(email, firstName, lastName);
    }

    return {
      statusCode: 200,
      body: "Token Verified and user registered",
      headers,
    };
  } catch (error) {
    console.error("An exception was thrown!");
    console.error(error.message);
    console.error(error);

    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error),
      headers,
    };
  }
}
