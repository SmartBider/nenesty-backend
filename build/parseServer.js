"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseServer = void 0;
// @ts-ignore
const parse_server_1 = __importDefault(require("parse-server"));
const config_1 = __importDefault(require("./config"));
const MoralisEthAdapter_1 = __importDefault(require("./auth/MoralisEthAdapter"));
// @ts-ignore
const parse_server_sendgrid_email_adapter_1 = __importDefault(require("parse-server-sendgrid-email-adapter"));
exports.parseServer = new parse_server_1.default({
    liveQuery: {
        classNames: ["ItemsMinted", "CollectionsPolygon"]
    },
    websocketTimeout: 60 * 1000,
    databaseURI: config_1.default.DATABASE_URI,
    cloud: config_1.default.CLOUD_PATH,
    serverURL: config_1.default.SERVER_URL,
    logsFolder: './logs',
    publicServerURL: config_1.default.SERVER_PUBLIC_URL,
    appName: config_1.default.APP_NAME,
    appId: config_1.default.APPLICATION_ID,
    masterKey: config_1.default.MASTER_KEY,
    auth: {
        moralisEth: {
            module: MoralisEthAdapter_1.default,
        },
    },
    verifyUserEmails: true,
    emailVerifyTokenValidityDuration: 2 * 60 * 60,
    emailAdapter: (0, parse_server_sendgrid_email_adapter_1.default)({
        apiKey: config_1.default.SENDGRID_MAIL_API_KEY,
        from: config_1.default.SENDGRID_MAIL_SENDER,
        passwordResetEmailTemplate: config_1.default.SENDGRID_PASS_RESET_EMAIL_TEMPLATE,
        verificationEmailTemplate: config_1.default.SENDGRID_VERIFY_EMAIL_TEMPLATE,
    }),
});
//# sourceMappingURL=parseServer.js.map