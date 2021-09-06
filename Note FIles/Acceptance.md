Acceptance Criteria :

<!-- Given An Unauthenticated User , in the sign up page And he didn't populate all the mandatory data { first name , last name , email address , Captcha and term Acceptance } Then he must not be able to send a request and a validation error must appear on each missing field

2-Given An Unauthenticated user , in the sign up page And he entered an invalid email then he must not be able to send a request And an invalid email message should appear in the email field

3-Given an Unauthenticated user , in the sign up page and he entered all the mandatory data and the email is valid then a request is sent And the user is redirected into email verification pin page .

4-Given an authenticated user ( redirected to pin verification page ) And he entered the verification correctly and the email is already registered then an email is sent notifying the user that the email is already registered .

5-Given an authenticated user ( redirected to pin verification page ) And he entered the verification correctly and the email is already unregistered before then the user must be added into logs And redirected to user verification page -->

<!-- . 6-Given a user in the user verification page and the user validated his phone number ( SMS validation) and the user is valid ( please check the note A for a valid user ) and the password is valid ( and matching in 2 text fields ) Then the user is verified and redirected to login page -->

<!-- 7-Given a user in the user verification page and the user validated his phone number ( SMS validation) and the user is not valid ( please check the notes for a valid user ) and the password is valid ( and matching in 2 text fields ) Then the user is redirected to a thank you page , and notified that the platform is not available for his country yet . notes : A) a user is valid if :(country and phone number are accepted) 1- IP and country are matching 2-phone number and phone number are matching 3- country is valid ————————————— B) An authenticated and valid user will be named as TRADER . —————————————————————————- -->
test
1-Given a user is trying to sign in and he didn't populate the user name or the password Then a message must be displayed in the missing field { email address cannot be empty or password cannot be empty }

2-Given a user is trying to sign in and he entered a non-registered email then an incorrect credentials message must appear

3- given a user trying to sign in and he entered a registered email and the password is incorrect Then an incorrect credentials message must appear

Given a user is trying to sign in and he entered user name and password correctly and the device used is trusted Then the user can choose 1 available MFA to enter When MFA code is entered correctly Then User is granted login access ( dashboard )

5-Given a user is trying to sign in and he entered user name and password correctly and the device used is new ( untrusted) Then the user must solve all available MFAs When all MFA codes entered correctly The User is granted login access ( dashboard ) And a < sign in from a new device> email is sent to user with an option to add to trusted devices .

6-

1- Email Verification Code : Given user trying to verify his email

and he entered get code then a 6 digits code must be sent to his email and user is redirected to enter the code the email is only validated when the 6 digits code is entered correctly { the user can resend the code after 60 seconds and the code must be active for 15 minutes only }

2- Phone verification Given a user trying to verify his phone number and he entered get code Then an SMS containing 6 digits code must be sent to his phone and the user is redirected to enter the code the phone is only validated when the 6 digits code is entered correctly { the user can resend the code after 60 seconds and the code must be active for 15 minutes only }

3-Google Authenticator Given a user trying to verify google authenticator code And he entered a 6 digits code and the code is valid Then the google authenticator access is valid
