"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDashboard = void 0;
//@ts-nocheck
const parse_dashboard_1 = __importDefault(require("parse-dashboard"));
const config_1 = __importDefault(require("./config"));
exports.parseDashboard = new parse_dashboard_1.default({
    "apps": [
        {
            appName: config_1.default.APP_NAME,
            serverURL: config_1.default.SERVER_PUBLIC_URL,
            appId: config_1.default.APPLICATION_ID,
            masterKey: config_1.default.MASTER_KEY,
            supportedPushLocales: ["en", "es"]
        },
    ],
    users: [
        {
            user: config_1.default.USER_DASHBOARD1,
            pass: config_1.default.USER_PASS_DASHBOARD1,
            apps: [{ "appId": config_1.default.APPLICATION_ID }]
        },
        {
            user: config_1.default.USER_DASHBOARD2,
            pass: config_1.default.USER_PASS_DASHBOARD2,
            apps: [{ "appId": config_1.default.APPLICATION_ID }]
        },
        {
            user: config_1.default.USER_DASHBOARD3,
            pass: config_1.default.USER_PASS_DASHBOARD3,
            apps: [{ "appId": config_1.default.APPLICATION_ID }]
        }
    ],
    trustProxy: 1
}, {
    allowInsecureHTTP: true,
    cookieSessionSecret: config_1.default.MASTER_KEY
});
//# sourceMappingURL=parseDashboard.js.map