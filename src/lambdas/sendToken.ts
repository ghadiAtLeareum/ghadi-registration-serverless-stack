import type {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import { getPayload, sendConfirmationCodeToUserEmail } from "../utils";
import { userSignupDataSchema } from "../schemas";
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
    const { email, acceptTerms, recaptchaToken } =
      await userSignupDataSchema.validate(body);

    const result = await sendConfirmationCodeToUserEmail(email);
    if (result) {
      console.log("Email sent");
    }

    return {
      statusCode: 200,
      body: "Email Sent",
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
