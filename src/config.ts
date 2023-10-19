import * as dotenv from 'dotenv';
import { cleanEnv, num, str, bool } from 'envalid';

dotenv.config();

export default cleanEnv(process.env, {
  APP_NAME: str({
    desc: 'Your name app',
  }),
  MORALIS_API_KEY: str({
    desc: 'Your moralis Api key (keep this secret)',
  }),  
  MORALIS_API_KEY_STREAMS: str({
    desc: 'Your moralis streams Api key (keep this secret)',
  }),
  SENDGRID_MAIL_API_KEY: str({
    desc: 'Your Sendgrid mail Api key (keep this secret)',
  }),
  SENDGRID_MAIL_SENDER: str({
    desc: 'Your mail for send email with api Sendgrid (keep this secret)',
  }),
  SENDGRID_VERIFY_EMAIL_TEMPLATE: str({
    desc: 'Sendgrid verify email template (keep this secret)',
  }),
  SENDGRID_PASS_RESET_EMAIL_TEMPLATE: str({
    desc: 'Sendgrid reset email template (keep this secret)',
  }),
  SENDGRID_EMAIL_TEMPLATE: str({
    desc: 'Sendgrid email template (keep this secret)',
  }),
  USER_DASHBOARD1: str({
    desc: 'User Dashboard 1 (keep this secret)',
  }),
  USER_PASS_DASHBOARD1: str({
    desc: 'Password Dashboard 1 (keep this secret)',
  }),
  USER_DASHBOARD2: str({
    desc: 'User Dashboard 2 (keep this secret)',
  }),
  USER_PASS_DASHBOARD2: str({
    desc: 'Password Dashboard 2 (keep this secret)',
  }),
  USER_DASHBOARD3: str({
    desc: 'User Dashboard 3 (keep this secret)',
  }),
  USER_PASS_DASHBOARD3: str({
    desc: 'Password Dashboard 3 (keep this secret)',
  }),
  ADMIN_ADDRES1: str({
    desc: 'Your ADMIN_ADDRES 1',
  }),
  ADMIN_ADDRES2: str({
    desc: 'Your ADMIN_ADDRES 2',
  }),
  ADMIN_ADDRES3: str({
    desc: 'Your ADMIN_ADDRES 3',
  }),
  ADMIN_ADDRES4: str({
    desc: 'Your ADMIN_ADDRES 4',
  }),
  ADMIN_ADDRES5: str({
    desc: 'Your ADMIN_ADDRES 5',
  }),
  ADMIN_ADDRES6: str({
    desc: 'Your ADMIN_ADDRES 6',
  }),
  PORT: num({
    desc: 'Default port wher parse-server will run on',
    default: 1337,
  }),
  HTTP_PORT: num({
    desc: 'Default port wher parse-server will run on',
    default: 1337,
  }),
  DATABASE_URI: str({
    desc: 'URI to your MongoDB database',
    devDefault: 'mongodb://localhost:27017',
  }),
  CLOUD_PATH: str({
    desc: 'Path to your cloud code',
    default: './build/cloud/main.js',
  }),
  MASTER_KEY: str({
    desc: 'A secret key of your choice (keep this secret)',
  }),
  APPLICATION_ID: str({
    desc: 'An id for your app, can be anything you want',
    default: 'APPLICATION_ID',
  }),
  SERVER_URL: str({
    desc: 'Referenece to your server URL. Replace this when your app is hosted',
    devDefault: 'http://localhost:1337/server',
  }),
  SERVER_PUBLIC_URL: str({
    desc: 'Referenece to your server URL. Replace this when your app is hosted example: https://lionfish-app-awg72.ondigitalocean.app/server',
    devDefault: 'http://localhost:1337/server',
  }),
  SERVER_URL_AUTH: str({
    desc: 'Referenece to your URL. Replace this when your app is hosted',
    devDefault: 'http://localhost:1337',
  }),
  REDIS_CONNECTION_STRING: str({
    desc: 'Connection string for your redis instance in the format of redis://<host>:<port> or redis://<username>:<password>@<host>:<port>',
    devDefault: 'redis://127.0.0.1:6379',
  }),
  RATE_LIMIT_TTL: num({
    desc: 'Rate limit window in seconds',
    default: 30,
  }),
  RATE_LIMIT_AUTHENTICATED: num({
    desc: 'Rate limit requests per window for authenticated users',
    default: 50,
  }),
  RATE_LIMIT_ANONYMOUS: num({
    desc: 'Rate limit requests per window for anonymous users',
    default: 20,
  }),
  USE_STREAMS: bool({
    desc: 'Enable streams sync',
    default: false,
  }),
  STREAMS_WEBHOOK_URL: str({
    desc: 'Webhook url for streams sync',
    default: '/streams-webhook',
  }),
});