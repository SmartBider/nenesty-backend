# Backend

🚀 Welcome! This project contains a backend for a self-hosted server with Moralis, using parse-server and express. Below are instructions for local development and deployment.

## Project Structure

- **`build/`:** Compiled files.
- **`logs/`:** Server state logs.
- **`scripts/`:** Additional scripts for project tasks.
- **`smart-contract/`:** Here you can find smart contracts related to your blockchain application.
- **`src/`:** Contains the project's source code.

## Getting Started Locally

Follow these steps to set up and run the project locally on your machine:

1. **Clone the Repository:** Download or clone this project to your local machine.

2. **Install Dependencies:** Ensure you have `yarn`, `npm`, or `pnpm` installed. Run the following command to install project dependencies:

    ```bash
    yarn install
    # or
    npm install
    # or
    pnpm install
    ```

3. **Set Up MongoDB:** Make sure you have a MongoDB instance running. For local development, you can use `mongodb-runner`. Start MongoDB with the following command:

    ```bash
    yarn dev:db-start
    ```

    To stop the MongoDB instance, use:

    ```bash
    yarn dev:db-stop
    ```

    Set the `DATABASE_URI` in your `.env` file.

    In order to run a server instance of parse-server, you will need to set up a MongoDB instance. For more information, refer to the [MongoDB installation documentation](https://www.mongodb.com/docs/manual/installation/).

    For local development, you can use the mongo-db-runner (see [mongo-db-runner GitHub repository](https://github.com/mongodb-js/runner)). **This should only be used for local development**.

4. **Set Up Redis:** Install and start Redis for rate-limiting functionality. Set the `REDIS_CONNECTION_STRING` in your `.env` file.

    For rate-limiting, we are using a Redis instance. In order for this to work, you will need to set up a Redis instance. For more information, refer to the [Redis documentation](https://redis.io/docs/getting-started/).

5. **Configure Environment Variables:** Copy `.env.example` to `.env` and fill in the required values.

6. **Run the Server:** Start the server locally using the following commands:

    ```bash
    yarn build
    # and
    yarn dev
    ```

    The server will run at `localhost:1337/server` or any other port/endpoint specified in your `.env` file.

# Necessary Environment Variables

Ensure to configure the following environment variables in your `.env` file for the application to function correctly:

- **`APP_NAME`:** Your application's name.
- **`MORALIS_API_KEY`:** Moralis API key for authentication.
- **`MORALIS_API_KEY_STREAMS`:** Moralis API key for streams.
- **`HTTP_PORT` and `PORT`:** Port on which the HTTP server will run locally.
- **`MASTER_KEY` and `APPLICATION_ID`:** Access keys for the parse server.
- **`SERVER_URL`:** Local parse server URL.
- **`SERVER_URL_AUTH` and `SERVER_PUBLIC_URL`:** Authentication and public access URLs of the server.
- **`CLOUD_PATH`:** Path to the compiled cloud code.
- **`DATABASE_URI`:** Connection URI for your MongoDB database.
- **`SENDGRID_MAIL_API_KEY`:** SendGrid API key for sending emails.
- **`SENDGRID_MAIL_SENDER`:** Email address from which emails will be sent.
- **`SENDGRID_VERIFY_EMAIL_TEMPLATE` and `SENDGRID_PASS_RESET_EMAIL_TEMPLATE`:** Email templates for email verification and password reset.
- **`USER_DASHBOARD1` to `USER_PASS_DASHBOARD3`:** Credentials for dashboard users.
- **`ADMIN_ADDRES1` to `ADMIN_ADDRES6`:** Wallet addresses of administrators.
- **`REDIS_CONNECTION_STRING`:** Connection URI for your Redis instance to limit request rate.
- **`RATE_LIMIT_TTL`, `RATE_LIMIT_AUTHENTICATED`, and `RATE_LIMIT_ANONYMOUS`:** Rate limits for authenticated and anonymous requests.
- **`USE_STREAMS`:** Indicates whether streams are enabled or not.
- **`STREAMS_WEBHOOK_URL`:** Webhook URL for streams.

Ensure to keep these keys and values secure and confidential. Do not share this information in public files or repositories.
