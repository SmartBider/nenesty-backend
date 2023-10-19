/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
import Parse from 'parse/node';

/*      
template id verify: d-14b1c0d89ea648dd8335d500fc189471
template id welcome: d-330654bf7bc649858b95f2c844979675
template id reset account: d-1f96ec531f544a12b52038da41b25a5e
*/

/* The code block `Parse.Cloud.define('sendVerificationEmail', async (request) => { ... })` is defining
a cloud function called `sendVerificationEmail`. This function is used to handle a request to send a
verification email to a user. */
Parse.Cloud.define('sendVerificationEmail', async (request) => {
  try {
    const { currentUser } = request.params;

    const User = Parse.Object.extend('_User');
    const query = new Parse.Query(User);
    query.equalTo('email', currentUser);

    const userObject = await query.first({ useMasterKey: true });

    if (userObject && !userObject.get('emailVerified')) {
      await Parse.User.requestEmailVerification(currentUser);
      return { success: true };
    }
    throw new Parse.Error(Parse.Error.INVALID_EMAIL_ADDRESS, 'Invalid email address or already verified.');
  } catch (error) {
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to send verification email.');
  }
});

/* The code block `Parse.Cloud.define('requestPasswordReset', async (request) => { ... })` is defining
a cloud function called `requestPasswordReset`. This function is used to handle a request to reset a
user's password. */
Parse.Cloud.define('requestPasswordReset', async (request) => {
  try {
    const { currentUser } = request.params;

    await Parse.User.requestPasswordReset(currentUser);
    return { success: true };
  } catch (error) {
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to send password reset email.');
  }
});
