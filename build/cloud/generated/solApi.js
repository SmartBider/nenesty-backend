"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const moralis_1 = __importDefault(require("moralis"));
const common_core_1 = require("@moralisweb3/common-core");
const rateLimit_1 = require("../../rateLimit");
const upgradeRequest_1 = require("../upgradeRequest");
const axios_1 = require("axios");
const common_sol_utils_1 = require("@moralisweb3/common-sol-utils");
/**
 * The function `getErrorMessage` returns an error message based on the type of error and the name of
 * the API being called.
 * @param {Error} error - The `error` parameter is an instance of the `Error` class, which represents a
 * generic error object. It can be any type of error that occurred during the execution of your code.
 * @param {string} name - The `name` parameter is a string that represents the name of the API being
 * called. It is used in the error message to provide context about which API encountered an error.
 * @returns an error message. If the error is an instance of MoralisError and contains Axios data, it
 * returns the JSON stringified version of the Axios response data. If the error is an instance of
 * Error, it returns the error message. If none of the conditions are met, it returns a generic API
 * error message with the name of the API being called.
 */
function getErrorMessage(error, name) {
    // Resolve Axios data inside the MoralisError
    if (error instanceof common_core_1.MoralisError &&
        error.cause &&
        error.cause instanceof axios_1.AxiosError &&
        error.cause.response &&
        error.cause.response.data) {
        return JSON.stringify(error.cause.response.data);
    }
    if (error instanceof Error) {
        return error.message;
    }
    return `API error while calling ${name}`;
}
/**
 * The function `getOperation` returns an operation based on its name.
 * @param {string} operationName - A string representing the name of the operation.
 * @returns an operation object of type `Operation<unknown, unknown, unknown, unknown>`.
 */
function getOperation(operationName) {
    const operation = common_sol_utils_1.operationsV2All.find((o) => o.name === operationName);
    if (!operation) {
        throw new Error(`Not supported operation ${operationName}`);
    }
    return operation;
}
/**
 * The function checks if the user and IP address have exceeded the rate limit before making an API
 * request.
 * @param {any} user - The `user` parameter represents the user making the API request. It could be an
 * object containing information about the user, such as their ID, username, or any other relevant
 * details.
 * @param {any} ip - The `ip` parameter represents the IP address of the client making the API request.
 * @param {string} name - The `name` parameter is a string that represents the name of the API being
 * requested.
 */
async function beforeApiRequest(user, ip, name) {
    if (!(await (0, rateLimit_1.handleRateLimit)(user, ip))) {
        throw new Error(`Too many requests to ${name} API from this particular client, the clients needs to wait before sending more requests.`);
    }
}
const balanceOperation = getOperation('getBalance');
/* The code block is defining a Cloud Function in the Parse Server environment. This specific function
is named "sol-balance". */
Parse.Cloud.define('sol-balance', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'balance');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, balanceOperation);
        const result = await moralis_1.default.SolApi.account.getBalance(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'sol-balance'));
    }
});
const getSPLOperation = getOperation('getSPL');
/* The code block is defining a Cloud Function in the Parse Server environment. This specific function
is named "sol-getSPL". */
Parse.Cloud.define('sol-getSPL', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getSPL');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getSPLOperation);
        const result = await moralis_1.default.SolApi.account.getSPL(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'sol-getSPL'));
    }
});
const getNFTsOperation = getOperation('getNFTs');
/* The code block is defining a Cloud Function in the Parse Server environment. This specific function
is named "sol-getNFTs". */
Parse.Cloud.define('sol-getNFTs', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTs');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTsOperation);
        const result = await moralis_1.default.SolApi.account.getNFTs(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'sol-getNFTs'));
    }
});
const getPortfolioOperation = getOperation('getPortfolio');
/* The code block is defining a Cloud Function in the Parse Server environment. This specific function
is named "sol-getPortfolio". */
Parse.Cloud.define('sol-getPortfolio', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getPortfolio');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getPortfolioOperation);
        const result = await moralis_1.default.SolApi.account.getPortfolio(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'sol-getPortfolio'));
    }
});
const getNFTMetadataOperation = getOperation('getNFTMetadata');
/* The code block is defining a Cloud Function in the Parse Server environment. This specific function
is named "sol-getNFTMetadata". */
Parse.Cloud.define('sol-getNFTMetadata', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTMetadata');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTMetadataOperation);
        const result = await moralis_1.default.SolApi.nft.getNFTMetadata(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'sol-getNFTMetadata'));
    }
});
const getTokenPriceOperation = getOperation('getTokenPrice');
/* The code block is defining a Cloud Function in the Parse Server environment. This specific function
is named "sol-getTokenPrice". */
Parse.Cloud.define('sol-getTokenPrice', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenPrice');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenPriceOperation);
        const result = await moralis_1.default.SolApi.token.getTokenPrice(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'sol-getTokenPrice'));
    }
});
//# sourceMappingURL=solApi.js.map