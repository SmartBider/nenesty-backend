"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const envalid_1 = require("envalid");
dotenv.config();
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    APP_NAME: (0, envalid_1.str)({
        desc: 'Your name app',
    }),
    MORALIS_API_KEY: (0, envalid_1.str)({
        desc: 'Your moralis Api key (keep this secret)',
    }),
    MORALIS_API_KEY_STREAMS: (0, envalid_1.str)({
        desc: 'Your moralis streams Api key (keep this secret)',
    }),
    SENDGRID_MAIL_API_KEY: (0, envalid_1.str)({
        desc: 'Your Sendgrid mail Api key (keep this secret)',
    }),
    SENDGRID_MAIL_SENDER: (0, envalid_1.str)({
        desc: 'Your mail for send email with api Sendgrid (keep this secret)',
    }),
    SENDGRID_VERIFY_EMAIL_TEMPLATE: (0, envalid_1.str)({
        desc: 'Sendgrid verify email template (keep this secret)',
    }),
    SENDGRID_PASS_RESET_EMAIL_TEMPLATE: (0, envalid_1.str)({
        desc: 'Sendgrid reset email template (keep this secret)',
    }),
    SENDGRID_EMAIL_TEMPLATE: (0, envalid_1.str)({
        desc: 'Sendgrid email template (keep this secret)',
    }),
    USER_DASHBOARD1: (0, envalid_1.str)({
        desc: 'User Dashboard 1 (keep this secret)',
    }),
    USER_PASS_DASHBOARD1: (0, envalid_1.str)({
        desc: 'Password Dashboard 1 (keep this secret)',
    }),
    USER_DASHBOARD2: (0, envalid_1.str)({
        desc: 'User Dashboard 2 (keep this secret)',
    }),
    USER_PASS_DASHBOARD2: (0, envalid_1.str)({
        desc: 'Password Dashboard 2 (keep this secret)',
    }),
    USER_DASHBOARD3: (0, envalid_1.str)({
        desc: 'User Dashboard 3 (keep this secret)',
    }),
    USER_PASS_DASHBOARD3: (0, envalid_1.str)({
        desc: 'Password Dashboard 3 (keep this secret)',
    }),
    ADMIN_ADDRES1: (0, envalid_1.str)({
        desc: 'Your ADMIN_ADDRES 1',
    }),
    ADMIN_ADDRES2: (0, envalid_1.str)({
        desc: 'Your ADMIN_ADDRES 2',
    }),
    ADMIN_ADDRES3: (0, envalid_1.str)({
        desc: 'Your ADMIN_ADDRES 3',
    }),
    ADMIN_ADDRES4: (0, envalid_1.str)({
        desc: 'Your ADMIN_ADDRES 4',
    }),
    ADMIN_ADDRES5: (0, envalid_1.str)({
        desc: 'Your ADMIN_ADDRES 5',
    }),
    ADMIN_ADDRES6: (0, envalid_1.str)({
        desc: 'Your ADMIN_ADDRES 6',
    }),
    PORT: (0, envalid_1.num)({
        desc: 'Default port wher parse-server will run on',
        default: 1337,
    }),
    HTTP_PORT: (0, envalid_1.num)({
        desc: 'Default port wher parse-server will run on',
        default: 1337,
    }),
    DATABASE_URI: (0, envalid_1.str)({
        desc: 'URI to your MongoDB database',
        devDefault: 'mongodb://localhost:27017',
    }),
    CLOUD_PATH: (0, envalid_1.str)({
        desc: 'Path to your cloud code',
        default: './build/cloud/main.js',
    }),
    MASTER_KEY: (0, envalid_1.str)({
        desc: 'A secret key of your choice (keep this secret)',
    }),
    APPLICATION_ID: (0, envalid_1.str)({
        desc: 'An id for your app, can be anything you want',
        default: 'APPLICATION_ID',
    }),
    SERVER_URL: (0, envalid_1.str)({
        desc: 'Referenece to your server URL. Replace this when your app is hosted',
        devDefault: 'http://localhost:1337/server',
    }),
    SERVER_PUBLIC_URL: (0, envalid_1.str)({
        desc: 'Referenece to your server URL. Replace this when your app is hosted example: https://lionfish-app-awg72.ondigitalocean.app/server',
        devDefault: 'http://localhost:1337/server',
    }),
    SERVER_URL_AUTH: (0, envalid_1.str)({
        desc: 'Referenece to your URL. Replace this when your app is hosted',
        devDefault: 'http://localhost:1337',
    }),
    REDIS_CONNECTION_STRING: (0, envalid_1.str)({
        desc: 'Connection string for your redis instance in the format of redis://<host>:<port> or redis://<username>:<password>@<host>:<port>',
        devDefault: 'redis://127.0.0.1:6379',
    }),
    RATE_LIMIT_TTL: (0, envalid_1.num)({
        desc: 'Rate limit window in seconds',
        default: 30,
    }),
    RATE_LIMIT_AUTHENTICATED: (0, envalid_1.num)({
        desc: 'Rate limit requests per window for authenticated users',
        default: 50,
    }),
    RATE_LIMIT_ANONYMOUS: (0, envalid_1.num)({
        desc: 'Rate limit requests per window for anonymous users',
        default: 20,
    }),
    USE_STREAMS: (0, envalid_1.bool)({
        desc: 'Enable streams sync',
        default: false,
    }),
    STREAMS_WEBHOOK_URL: (0, envalid_1.str)({
        desc: 'Webhook url for streams sync',
        default: '/streams-webhook',
    }),
});
//# sourceMappingURL=config.js.map