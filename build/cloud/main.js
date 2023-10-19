"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./collections");
require("./functionMarket");
require("./renderNft");
require("./stripe");
require("./user");
require("./sendingEmails");
require("./followerFollowing");
const authService_1 = require("../auth/authService");
/* The code `Parse.Cloud.define('requestMessage', async ({ params }: any) => { ... })` is defining a
cloud function named `requestMessage` in the Parse server. */
Parse.Cloud.define('requestMessage', async ({ params }) => {
    const { address, chain, networkType } = params;
    const message = await (0, authService_1.requestMessage)({
        address,
        chain,
        networkType,
    });
    return { message };
});
/* The code `Parse.Cloud.define('getPluginSpecs', () => { ... })` is defining a cloud function named
`getPluginSpecs` in the Parse server. This function is not implemented and only exists to remove
client-side errors when using the moralis-v1 package. It returns an empty array `[]`. */
Parse.Cloud.define('getPluginSpecs', () => {
    // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
    return [];
});
/* The code `Parse.Cloud.define('getServerTime', () => { ... })` is defining a cloud function named
`getServerTime` in the Parse server. However, this function is not implemented and only exists to
remove client-side errors when using the moralis-v1 package. It returns `null`, indicating that it
does not perform any specific functionality. */
Parse.Cloud.define('getServerTime', () => {
    // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
    return null;
});
exports.default = Parse;
//# sourceMappingURL=main.js.map