1- Trader must enter Mandatory data
{First name , Last name , Email , accept terms , captcha } , if any field is not populated , we do not send the request.

2- If a user entered all mandatory data and the data is validated , than user redirected to a page where he can request "Get code" by email .
Then a confirmation email will be sent to the user.
Get code : every 60 secs, after 2 attempts - block 1 hrs.( variable can be edited) with message presented to user about time. for next get code.
than block 24 hr after the next 3 attempts.

every time user successfully get code action : code is changed.
https://medium.com/authenticate/account-locking-based-on-otp-failed-attempts-1ccb17523aaf ( check best practice )

3- Given <a user is trying to insert the verification pin with Captcha , And he entered a wrong PIN, then an error appears on the screen. and the number of left attempts must appear ( out of 3 )
and block for ( 1 hr variable time controlled by admin) than 3 more attempts than block 24 hrs. ( variable time control admin.)

4- Given a user <sent a signup request> and the email is already registered Then email the user notifying him that this email is already registered

5- Given < a user entered the verification pin correctly >And the email is not registered THEN the user is redirected to enter PASSWORD AND CONFIRM PASSWORD ( requirements , 1 cap - minimum 8 char , 1 special character ), than register the user successfully .

6- USER loose session ? than repeat process { Rollback to very beginning}

7- after user successfully registered , he is redirected to page where he must input country + phone number , and OTP ( using Get OTP by sending SMS to the phone number he registered)
a-Country : should be validated from list predefined in our system.{ list all possible countries}

b-Phone number international code must be predefined with the country list : example If in the country he choose Lebanon . +961 should be predefined where user is requested to input only the 8 digits of the local number. ( 70111111)
-phone number must be unique

c- Get OTP every 60 secs, after 2 attempts - block 1 hr( variable can be edited) with message presented to user about time. for next get code.
than block 24 hr after the next 3 attempts.
https://medium.com/authenticate/account-locking-based-on-otp-failed-attempts-1ccb17523aaf ( check best practice )

every time user get OTP successful action , code is changed

8-If the user entered The phone SMS token correctly and his country is Invalid then he be successfully registered to the system. -> redirect the user to a page notifying that "NOT AVAILABLE FOR YOUR COUNTRY"

9-If the user entered The phone SMS token correctly and his country is valid then he be successfully registered to the system. -> dashboard.
