//@ts-nocheck
import ParseDashboard from "parse-dashboard";
import config from "./config";

export const parseDashboard = new ParseDashboard(
  {
    "apps": [
      {
        appName: config.APP_NAME,
        serverURL: config.SERVER_PUBLIC_URL,
        appId: config.APPLICATION_ID,
        masterKey: config.MASTER_KEY,
        supportedPushLocales: ["en", "es"]
      },
    ],
    users: [
      {
        user: config.USER_DASHBOARD1,
        pass: config.USER_PASS_DASHBOARD1,
        apps: [{"appId": config.APPLICATION_ID}]

      },
      {
        user: config.USER_DASHBOARD2,
        pass: config.USER_PASS_DASHBOARD2,
        apps: [{"appId": config.APPLICATION_ID}]
      },
      {
        user: config.USER_DASHBOARD3,
        pass: config.USER_PASS_DASHBOARD3,
        apps: [{"appId": config.APPLICATION_ID}]
      }
    ],
    trustProxy: 1

  },
  { 
    allowInsecureHTTP: true,
    cookieSessionSecret: config.MASTER_KEY 
  },
  
);