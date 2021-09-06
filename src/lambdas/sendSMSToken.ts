import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { getPayload, sendSMSVerificationToken } from "../utils";
import { userTokenSendSchema } from "../schemas";
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
    const { email, phoneNumber } = await userTokenSendSchema.validate(body);

    const result = await sendSMSVerificationToken(email, phoneNumber);
    if (result) {
      console.log(result);
    }

    return {
      statusCode: 200,
      body: "SMS Sent",
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
