"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestMessage = void 0;
const moralis_1 = __importDefault(require("moralis"));
const config_1 = __importDefault(require("../config"));
const STATEMENT = 'Welcome to nenesty, Please sign this message to confirm your identity.';
const EXPIRATION_TIME = 9000000;
const TIMEOUT = 15;
async function requestMessage({ address, chain, networkType, }) {
    const url = new URL(config_1.default.SERVER_URL_AUTH);
    const urltoString = url === null || url === void 0 ? void 0 : url.toString();
    const now = new Date();
    const expirationTime = new Date(now.getTime() + EXPIRATION_TIME);
    const result = await moralis_1.default.Auth.requestMessage({
        address,
        chain,
        networkType,
        domain: url.hostname,
        uri: urltoString,
        statement: STATEMENT,
        notBefore: now.toISOString(),
        expirationTime: expirationTime.toISOString(),
        timeout: TIMEOUT,
    });
    const { message } = result.toJSON();
    return message;
}
exports.requestMessage = requestMessage;
//# sourceMappingURL=authService.js.map