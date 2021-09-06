import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import {
  getPayload,
  sendConfirmationCodeToUserEmail,
  checkConfirmationToken,
} from "../utils";
import { userTokenConfirmationSchema } from "../schemas";
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
    const { email, token, firstName, lastName } = body;
    await userTokenConfirmationSchema.validate(body);

    const result = await checkConfirmationToken(email);
    console.log("this is the result user: ");
    console.log(result);

    const userToken = result.token;
    console.log("this is the user token: ");
    console.log(userToken);

    const tokenTimeOut = result.tokenVerificationTimeStamp;
    console.log("this is the user tokenTimeOut");
    console.log(tokenTimeOut);

    if (userToken != token) {
      await sendConfirmationCodeToUserEmail(email);
      return {
        statusCode: 400,
        body: "Wrong token , please check your email for the new one",
        headers,
      };
    }

    const now = Date.now() / 1000 - 5 * 60;
    console.log("this is the date now");
    console.log(now);

    if (tokenTimeOut < now) {
      await sendConfirmationCodeToUserEmail(email);
      return {
        statusCode: 400,
        body: "Token Expired , please check your email for the new one",
        headers,
      };
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
