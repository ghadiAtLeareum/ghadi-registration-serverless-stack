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
