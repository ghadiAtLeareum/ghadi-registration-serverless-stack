import { string, object, boolean } from "yup";
import axios from "axios";
import { recaptchaSecret } from "./config";
import { stringify as qsStringify } from "qs";

export const email = string().email().required();

export const jsonContentType = string()
  .required("Invalid JSON content type")
  .test("is-json", "Invalid content type header", (ct) => {
    if (typeof ct !== "string") {
      return false;
    }
    const split = ct.split(";");
    for (let i = 0; i < split.length; i++) {
      const value = split[i].trimStart();
      if (value === "application/json") {
        return true;
      }
    }
    return false;
  });

export const recaptchaVerificationResponseSchema = object({
  success: boolean().required(),
  // other fields are not used in our app.
});

export const recaptchaV2VerificationSchema = object({
  recaptchaToken: string().required(),
  remoteIp: string().optional(),
})
  .required("Recaptcha is required")
  .test(
    "is-recaptcha-valid",
    "Recaptcha is not valid",
    async function ({ recaptchaToken, remoteIp }) {
      const body = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        qsStringify({
          secret: recaptchaSecret,
          response: recaptchaToken,
          remoteip: remoteIp ? remoteIp : null,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const result = await recaptchaVerificationResponseSchema.validate(
        body.data
      );
      return result.success;
    }
  );

export const userSignupDataSchema = object({
  email: string().email().required(),
  acceptTerms: string().required(),
  recaptchaToken: boolean().required(),
});

export const userTokenConfirmationSchema = object({
  email: string().email().required(),
  token: string().required(),
});

export const userTokenSendSchema = object({
  email: string().email().required(),
  phoneNumber: string().required(),
});

export const userTokenCheckSchema = object({
  email: string().email().required(),
  firstName: string().required(),
  lastName: string().required(),
  token: string().required(),
  phoneNumber: string().required(),
});
