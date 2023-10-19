"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
const node_1 = __importDefault(require("parse/node"));
/*
template id verify: d-14b1c0d89ea648dd8335d500fc189471
template id welcome: d-330654bf7bc649858b95f2c844979675
template id reset account: d-1f96ec531f544a12b52038da41b25a5e
*/
/* The code block `Parse.Cloud.define('sendVerificationEmail', async (request) => { ... })` is defining
a cloud function called `sendVerificationEmail`. This function is used to handle a request to send a
verification email to a user. */
node_1.default.Cloud.define('sendVerificationEmail', async (request) => {
    try {
        const { currentUser } = request.params;
        const User = node_1.default.Object.extend('_User');
        const query = new node_1.default.Query(User);
        query.equalTo('email', currentUser);
        const userObject = await query.first({ useMasterKey: true });
        if (userObject && !userObject.get('emailVerified')) {
            await node_1.default.User.requestEmailVerification(currentUser);
            return { success: true };
        }
        throw new node_1.default.Error(node_1.default.Error.INVALID_EMAIL_ADDRESS, 'Invalid email address or already verified.');
    }
    catch (error) {
        throw new node_1.default.Error(node_1.default.Error.INTERNAL_SERVER_ERROR, 'Failed to send verification email.');
    }
});
/* The code block `Parse.Cloud.define('requestPasswordReset', async (request) => { ... })` is defining
a cloud function called `requestPasswordReset`. This function is used to handle a request to reset a
user's password. */
node_1.default.Cloud.define('requestPasswordReset', async (request) => {
    try {
        const { currentUser } = request.params;
        await node_1.default.User.requestPasswordReset(currentUser);
        return { success: true };
    }
    catch (error) {
        throw new node_1.default.Error(node_1.default.Error.INTERNAL_SERVER_ERROR, 'Failed to send password reset email.');
    }
});
//# sourceMappingURL=sendingEmails.js.map