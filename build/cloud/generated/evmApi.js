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
/* The code is a test suite for the `upgradeRequest` function. It tests various scenarios and
expectations for the behavior of the `upgradeRequest` function. */
// @ts-ignore
const common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
/**
 * The function `getErrorMessage` returns an error message based on the type of error and the name of
 * the API being called.
 * @param {Error} error - The `error` parameter is an instance of the `Error` class, which represents a
 * generic error object. It can be any type of error that occurred during the execution of your code.
 * @param {string} name - The `name` parameter is a string that represents the name or identifier of
 * the API call that encountered an error.
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
    const operation = common_evm_utils_1.operationsV2All.find((o) => o.name === operationName);
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
const getBlockOperation = getOperation('getBlock');
/* The above code is defining a Parse Cloud function called 'getBlock'. This function takes in three
parameters: 'params', 'user', and 'ip'. */
Parse.Cloud.define('getBlock', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getBlock');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getBlockOperation);
        const result = await moralis_1.default.EvmApi.block.getBlock(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getBlock'));
    }
});
const getDateToBlockOperation = getOperation('getDateToBlock');
/* The above code is defining a Parse Cloud function called "getDateToBlock". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getDateToBlock', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getDateToBlock');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getDateToBlockOperation);
        const result = await moralis_1.default.EvmApi.block.getDateToBlock(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getDateToBlock'));
    }
});
const getLogsByAddressOperation = getOperation('getContractLogs');
/* The above code is defining a Parse Cloud function called 'getLogsByAddress'. This function takes in
three parameters: 'params', 'user', and 'ip'. */
Parse.Cloud.define('getLogsByAddress', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getLogsByAddress');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getLogsByAddressOperation);
        const result = await moralis_1.default.EvmApi.events.getContractLogs(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getLogsByAddress'));
    }
});
const getNFTTransfersByBlockOperation = getOperation('getNFTTransfersByBlock');
/* The above code is defining a Cloud Function in Parse Server using TypeScript. The function is named
"getNFTTransfersByBlock" and it is an asynchronous function that takes in three parameters:
"params", "user", and "ip". */
Parse.Cloud.define('getNFTTransfersByBlock', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTTransfersByBlock');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTTransfersByBlockOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTTransfersByBlock(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTTransfersByBlock'));
    }
});
const getTransactionOperation = getOperation('getTransaction');
/* The above code is defining a Parse Cloud function called "getTransaction". This function takes in
three parameters: "params", "user", and "ip". It is an asynchronous function that handles errors
using try-catch blocks. */
Parse.Cloud.define('getTransaction', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTransaction');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTransactionOperation);
        const result = await moralis_1.default.EvmApi.transaction.getTransaction(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTransaction'));
    }
});
const getContractEventsOperation = getOperation('getContractEvents');
/* The above code is defining a Parse Cloud function called 'getContractEvents'. This function takes in
three parameters: 'params', 'user', and 'ip'. */
Parse.Cloud.define('getContractEvents', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getContractEvents');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getContractEventsOperation);
        const result = await moralis_1.default.EvmApi.events.getContractEvents(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getContractEvents'));
    }
});
const runContractFunctionOperation = getOperation('runContractFunction');
/* The above code is defining a Parse Cloud function called "runContractFunction". This function takes
in three parameters: "params", "user", and "ip". */
Parse.Cloud.define('runContractFunction', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'runContractFunction');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, runContractFunctionOperation);
        const result = await moralis_1.default.EvmApi.utils.runContractFunction(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'runContractFunction'));
    }
});
const getTransactionsOperation = getOperation('getWalletTransactions');
/* The above code is defining a Parse Cloud function called "getTransactions". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getTransactions', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTransactions');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTransactionsOperation);
        const result = await moralis_1.default.EvmApi.transaction.getWalletTransactions(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTransactions'));
    }
});
const getTransactionsVerboseOperation = getOperation('getWalletTransactionsVerbose');
/* The above code is defining a Parse Cloud function called 'getTransactionsVerbose'. This function
takes in three parameters: 'params', 'user', and 'ip'. */
Parse.Cloud.define('getTransactionsVerbose', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTransactionsVerbose');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTransactionsVerboseOperation);
        const result = await moralis_1.default.EvmApi.transaction.getWalletTransactionsVerbose(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTransactionsVerbose'));
    }
});
const getNativeBalanceOperation = getOperation('getNativeBalance');
/* The above code is defining a Parse Cloud function called 'getNativeBalance'. This function takes in
three parameters: 'params', 'user', and 'ip'. */
Parse.Cloud.define('getNativeBalance', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNativeBalance');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNativeBalanceOperation);
        const result = await moralis_1.default.EvmApi.balance.getNativeBalance(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNativeBalance'));
    }
});
const getTokenBalancesOperation = getOperation('getWalletTokenBalances');
/* The above code is defining a Parse Cloud function called 'getTokenBalances'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user', 'ip', and 'getTokenBalances' as arguments. Then, it upgrades the 'params'
using the 'upgradeRequest' function and passes it to the 'getTokenBalancesOperation' function. The
result of this operation is stored in the 'result' variable. Finally, the function returns the 'raw'
property of the 'result' object */
Parse.Cloud.define('getTokenBalances', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenBalances');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenBalancesOperation);
        const result = await moralis_1.default.EvmApi.token.getWalletTokenBalances(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenBalances'));
    }
});
const getTokenTransfersOperation = getOperation('getWalletTokenTransfers');
/* The above code is defining a Parse Cloud function called "getTokenTransfers". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getTokenTransfers', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenTransfers');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenTransfersOperation);
        const result = await moralis_1.default.EvmApi.token.getWalletTokenTransfers(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenTransfers'));
    }
});
const getNFTsOperation = getOperation('getWalletNFTs');
/* The above code is defining a Parse Cloud function called 'getNFTs'. This function takes in three
parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user' and 'ip' parameters. Then, it upgrades the 'params' object using the
'upgradeRequest' function and passes it to the 'getNFTsOperation' function. Finally, it calls the
'Moralis.EvmApi.nft.getWalletNFTs' function with the upgraded request and returns the result. If an
error */
Parse.Cloud.define('getNFTs', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTs');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTsOperation);
        const result = await moralis_1.default.EvmApi.nft.getWalletNFTs(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTs'));
    }
});
const getNFTTransfersOperation = getOperation('getWalletNFTTransfers');
/* The above code is defining a Parse Cloud function called 'getNFTTransfers'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user', 'ip', and 'getNFTTransfers' as arguments. Then, it upgrades the 'params'
using the 'upgradeRequest' function and passes it to the 'getWalletNFTTransfers' function of the
Moralis EvmApi. The result of this function call is returned as the response of the Parse Cloud
function. */
Parse.Cloud.define('getNFTTransfers', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTTransfers');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTTransfersOperation);
        const result = await moralis_1.default.EvmApi.nft.getWalletNFTTransfers(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTTransfers'));
    }
});
const getWalletNFTCollectionsOperation = getOperation('getWalletNFTCollections');
/* The above code is defining a Cloud Function in Parse Server using TypeScript. The function is named
'getWalletNFTCollections' and it is an asynchronous function that takes in three parameters:
'params', 'user', and 'ip'. */
Parse.Cloud.define('getWalletNFTCollections', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getWalletNFTCollections');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getWalletNFTCollectionsOperation);
        const result = await moralis_1.default.EvmApi.nft.getWalletNFTCollections(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getWalletNFTCollections'));
    }
});
const getNFTsForContractOperation = getOperation('getWalletNFTs');
/* The above code is defining a Parse Cloud function called 'getNFTsForContract'. This function takes
in three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the
'beforeApiRequest' function, passing in the 'user', 'ip', and a string 'getNFTsForContract'. Then,
it calls the 'upgradeRequest' function, passing in the 'params' and 'getNFTsForContractOperation'.
The result of this function call is stored in the 'request' variable. Finally, it calls the 'Moralis */
Parse.Cloud.define('getNFTsForContract', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTsForContract');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTsForContractOperation);
        const result = await moralis_1.default.EvmApi.nft.getWalletNFTs(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTsForContract'));
    }
});
const getTokenMetadataOperation = getOperation('getTokenMetadata');
/* The above code is defining a Parse Cloud function called "getTokenMetadata". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getTokenMetadata', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenMetadata');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenMetadataOperation);
        const result = await moralis_1.default.EvmApi.token.getTokenMetadata(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenMetadata'));
    }
});
const getNFTTradesOperation = getOperation('getNFTTrades');
/* The above code is defining a Parse Cloud function called 'getNFTTrades'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user', 'ip', and 'getNFTTrades' as arguments. Then, it upgrades the 'params'
object using the 'upgradeRequest' function and passes it to the 'getNFTTradesOperation' function.
Finally, it calls the 'Moralis.EvmApi.nft.getNFTTrades' function with the */
Parse.Cloud.define('getNFTTrades', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTTrades');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTTradesOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTTrades(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTTrades'));
    }
});
const getNFTLowestPriceOperation = getOperation('getNFTLowestPrice');
/* The above code is defining a Parse Cloud function called 'getNFTLowestPrice'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user', 'ip', and 'getNFTLowestPrice' as arguments. Then, it upgrades the request
using the 'upgradeRequest' function with the 'params' and 'getNFTLowestPriceOperation' as arguments.
Finally, it calls the 'Moralis.EvmApi.nft.getNFTLowestPrice' */
Parse.Cloud.define('getNFTLowestPrice', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTLowestPrice');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTLowestPriceOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTLowestPrice(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTLowestPrice'));
    }
});
const getTokenMetadataBySymbolOperation = getOperation('getTokenMetadataBySymbol');
/* The above code is defining a Parse Cloud function called 'getTokenMetadataBySymbol'. This function
takes in three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the
'beforeApiRequest' function, passing in the 'user', 'ip', and the name of the current operation
('getTokenMetadataBySymbol'). Then, it upgrades the request by calling the 'upgradeRequest'
function, passing in the 'params' and the 'getTokenMetadataBySymbolOperation'. Finally, it calls the
'Moralis.EvmApi.token.getTokenMetadataBySymbol' function, passing */
Parse.Cloud.define('getTokenMetadataBySymbol', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenMetadataBySymbol');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenMetadataBySymbolOperation);
        const result = await moralis_1.default.EvmApi.token.getTokenMetadataBySymbol(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenMetadataBySymbol'));
    }
});
const getTokenPriceOperation = getOperation('getTokenPrice');
/* The above code is defining a Parse Cloud function called "getTokenPrice". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getTokenPrice', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenPrice');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenPriceOperation);
        const result = await moralis_1.default.EvmApi.token.getTokenPrice(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenPrice'));
    }
});
const getTokenAddressTransfersOperation = getOperation('getTokenTransfers');
/* The above code is defining a Parse Cloud function called 'getTokenAddressTransfers'. This function
takes in parameters such as 'params', 'user', and 'ip'. Inside the function, it calls the
'beforeApiRequest' function to perform some pre-request checks. Then, it upgrades the request using
the 'upgradeRequest' function and passes it to the 'getTokenAddressTransfersOperation' function.
Finally, it calls the 'Moralis.EvmApi.token.getTokenTransfers' function to get token transfers and
returns the result. If there is an error, it throws an error with a custom */
Parse.Cloud.define('getTokenAddressTransfers', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenAddressTransfers');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenAddressTransfersOperation);
        const result = await moralis_1.default.EvmApi.token.getTokenTransfers(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenAddressTransfers'));
    }
});
const getTokenAllowanceOperation = getOperation('getTokenAllowance');
/* The above code is defining a Parse Cloud function called 'getTokenAllowance'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user', 'ip', and 'getTokenAllowance' as arguments. Then, it upgrades the request
using the 'upgradeRequest' function with the 'params' and 'getTokenAllowanceOperation' as arguments.
Finally, it calls the 'Moralis.EvmApi.token.getTokenAllowance' function with the upgraded request
and returns the result. If there is */
Parse.Cloud.define('getTokenAllowance', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenAllowance');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenAllowanceOperation);
        const result = await moralis_1.default.EvmApi.token.getTokenAllowance(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenAllowance'));
    }
});
/* The above code is defining a Cloud Function named "searchNFTs" in Parse Server. However, the
function is throwing an error with the message 'searchNFTs is not supported anymore'. */
Parse.Cloud.define('searchNFTs', async (_) => {
    throw new Error('searchNFTs is not supported anymore');
});
const getNftTransfersFromToBlockOperation = getOperation('getNFTTransfersFromToBlock');
/* The above code is defining a Cloud Function in Parse Server using TypeScript. The function is named
"getNftTransfersFromToBlock" and it is defined with an async function. */
Parse.Cloud.define('getNftTransfersFromToBlock', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNftTransfersFromToBlock');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNftTransfersFromToBlockOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTTransfersFromToBlock(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNftTransfersFromToBlock'));
    }
});
const getAllTokenIdsOperation = getOperation('getContractNFTs');
/* The above code is defining a Parse Cloud function called "getAllTokenIds". This function takes in
three parameters: "params", "user", and "ip". Inside the function, it calls the "beforeApiRequest"
function with the "user" and "ip" parameters. Then, it upgrades the "params" object using the
"upgradeRequest" function and passes it to the "getAllTokenIdsOperation" function. Finally, it calls
the "Moralis.EvmApi.nft.getContractNFTs" function with the upgraded request and returns the result.
If there is an error */
Parse.Cloud.define('getAllTokenIds', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getAllTokenIds');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getAllTokenIdsOperation);
        const result = await moralis_1.default.EvmApi.nft.getContractNFTs(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getAllTokenIds'));
    }
});
const getMultipleNFTsOperation = getOperation('getMultipleNFTs');
/* The above code is defining a Parse Cloud function called 'getMultipleNFTs'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user', 'ip', and 'getMultipleNFTs' as arguments. Then, it upgrades the 'params'
using the 'upgradeRequest' function with the 'getMultipleNFTsOperation' as an argument. Finally, it
calls the 'Moralis.EvmApi.nft.getMultipleNFTs' function with the upgraded request */
Parse.Cloud.define('getMultipleNFTs', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getMultipleNFTs');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getMultipleNFTsOperation);
        const result = await moralis_1.default.EvmApi.nft.getMultipleNFTs(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getMultipleNFTs'));
    }
});
const getContractNFTTransfersOperation = getOperation('getNFTContractTransfers');
/* The above code is defining a Cloud Function in Parse Server using TypeScript. The function is named
'getContractNFTTransfers' and it is an asynchronous function that takes in three parameters:
'params', 'user', and 'ip'. */
Parse.Cloud.define('getContractNFTTransfers', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getContractNFTTransfers');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getContractNFTTransfersOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTContractTransfers(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getContractNFTTransfers'));
    }
});
const getNFTOwnersOperation = getOperation('getNFTOwners');
/* The above code is defining a Parse Cloud function called 'getNFTOwners'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function, passing in the 'user', 'ip', and a string 'getNFTOwners'. Then, it calls the
'upgradeRequest' function, passing in the 'params' and 'getNFTOwnersOperation'. The result of this
function call is stored in the 'request' variable. Finally, it calls the 'Moralis.EvmApi.nft.get */
Parse.Cloud.define('getNFTOwners', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTOwners');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTOwnersOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTOwners(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTOwners'));
    }
});
const getNFTMetadataOperation = getOperation('getNFTContractMetadata');
/* The above code is defining a Parse Cloud function called 'getNFTMetadata'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user' and 'ip' parameters. Then, it upgrades the 'params' object using the
'upgradeRequest' function and passes it to the 'getNFTMetadataOperation' function. Finally, it calls
the 'Moralis.EvmApi.nft.getNFTContractMetadata' function with the upgraded request and returns the
result. If an error */
Parse.Cloud.define('getNFTMetadata', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getNFTMetadata');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getNFTMetadataOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTContractMetadata(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getNFTMetadata'));
    }
});
const reSyncMetadataOperation = getOperation('reSyncMetadata');
/* The above code is defining a Parse Cloud function called "reSyncMetadata". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('reSyncMetadata', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'reSyncMetadata');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, reSyncMetadataOperation);
        const result = await moralis_1.default.EvmApi.nft.reSyncMetadata(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'reSyncMetadata'));
    }
});
const syncNFTContractOperation = getOperation('syncNFTContract');
/* The above code is defining a Parse Cloud function called "syncNFTContract". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('syncNFTContract', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'syncNFTContract');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, syncNFTContractOperation);
        const result = await moralis_1.default.EvmApi.nft.syncNFTContract(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'syncNFTContract'));
    }
});
const getTokenIdMetadataOperation = getOperation('getNFTMetadata');
/* The above code is defining a Parse Cloud function called "getTokenIdMetadata". This function takes
in three parameters: "params", "user", and "ip". It is an asynchronous function that handles errors
using try-catch blocks. */
Parse.Cloud.define('getTokenIdMetadata', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenIdMetadata');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenIdMetadataOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTMetadata(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenIdMetadata'));
    }
});
const getTokenIdOwnersOperation = getOperation('getNFTTokenIdOwners');
/* The above code is defining a Parse Cloud function called "getTokenIdOwners". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getTokenIdOwners', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getTokenIdOwners');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getTokenIdOwnersOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTTokenIdOwners(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getTokenIdOwners'));
    }
});
const getWalletTokenIdTransfersOperation = getOperation('getNFTTransfers');
/* The above code is defining a Cloud Function in Parse Server using TypeScript. The function is named
'getWalletTokenIdTransfers' and it is an asynchronous function that takes in three parameters:
'params', 'user', and 'ip'. */
Parse.Cloud.define('getWalletTokenIdTransfers', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getWalletTokenIdTransfers');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getWalletTokenIdTransfersOperation);
        const result = await moralis_1.default.EvmApi.nft.getNFTTransfers(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getWalletTokenIdTransfers'));
    }
});
const resolveDomainOperation = getOperation('resolveDomain');
/* The above code is defining a Parse Cloud function called 'resolveDomain'. This function takes in
three parameters: 'params', 'user', and 'ip'. Inside the function, it calls the 'beforeApiRequest'
function with the 'user', 'ip', and 'resolveDomain' as arguments. Then, it upgrades the request
using the 'upgradeRequest' function with the 'params' and 'resolveDomainOperation' as arguments.
Finally, it calls the 'Moralis.EvmApi.resolve.resolveDomain' function with the upgraded request and
returns the result. If there is an error, it */
Parse.Cloud.define('resolveDomain', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'resolveDomain');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, resolveDomainOperation);
        const result = await moralis_1.default.EvmApi.resolve.resolveDomain(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'resolveDomain'));
    }
});
const resolveAddressOperation = getOperation('resolveAddress');
/* The above code is defining a Parse Cloud function called "resolveAddress". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('resolveAddress', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'resolveAddress');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, resolveAddressOperation);
        const result = await moralis_1.default.EvmApi.resolve.resolveAddress(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'resolveAddress'));
    }
});
const getPairReservesOperation = getOperation('getPairReserves');
/* The above code is defining a Parse Cloud function called "getPairReserves". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getPairReserves', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getPairReserves');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getPairReservesOperation);
        const result = await moralis_1.default.EvmApi.defi.getPairReserves(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getPairReserves'));
    }
});
const getPairAddressOperation = getOperation('getPairAddress');
/* The above code is defining a Parse Cloud function called "getPairAddress". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('getPairAddress', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'getPairAddress');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, getPairAddressOperation);
        const result = await moralis_1.default.EvmApi.defi.getPairAddress(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'getPairAddress'));
    }
});
const uploadFolderOperation = getOperation('uploadFolder');
/* The above code is defining a Parse Cloud function called "uploadFolder". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('uploadFolder', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'uploadFolder');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, uploadFolderOperation);
        const result = await moralis_1.default.EvmApi.ipfs.uploadFolder(request);
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'uploadFolder'));
    }
});
const web3ApiVersionOperation = getOperation('web3ApiVersion');
/* The above code is defining a Parse Cloud function called "web3ApiVersion". This function takes in
three parameters: "params", "user", and "ip". */
Parse.Cloud.define('web3ApiVersion', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'web3ApiVersion');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, web3ApiVersionOperation);
        const result = await moralis_1.default.EvmApi.utils.web3ApiVersion();
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'web3ApiVersion'));
    }
});
const endpointWeightsOperation = getOperation('endpointWeights');
/* The above code is defining a Parse Cloud function called "endpointWeights". This function is an
asynchronous function that takes in three parameters: "params", "user", and "ip". */
Parse.Cloud.define('endpointWeights', async ({ params, user, ip }) => {
    try {
        await beforeApiRequest(user, ip, 'endpointWeights');
        const request = (0, upgradeRequest_1.upgradeRequest)(params, endpointWeightsOperation);
        const result = await moralis_1.default.EvmApi.utils.endpointWeights();
        return result === null || result === void 0 ? void 0 : result.raw;
    }
    catch (error) {
        throw new Error(getErrorMessage(error, 'endpointWeights'));
    }
});
//# sourceMappingURL=evmApi.js.map