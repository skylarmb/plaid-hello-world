require("dotenv").config();
const express = require("express");
const moment = require("moment");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

app.use(
  // TODO: use a real secret key
  session({ secret: "keyboard cat", saveUninitialized: true, resave: true })
);

app.use(bodyParser.json());

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const client = new PlaidApi(config);

const formatDate = (date) => date.toISOString().split("T")[0]; // Date to ISO 8601 format

// create a link_token for use in Plaid Link
app.get("/api/create_link_token", async (req, res, next) => {
  const tokenResponse = await client.linkTokenCreate({
    user: { client_user_id: req.sessionID },
    client_name: "Plaid Hello World",
    language: "en",
    products: ["transactions"],
    country_codes: ["US", "CA"],
  });
  res.json(tokenResponse.data);
});

// exchange the public_token from Plaid Link for an access_token
app.post("/api/exchange_public_token", async (req, res, next) => {
  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });

  // TODO: store access_token in DB instead of session storage
  req.session.access_token = exchangeResponse.data.access_token;
  res.json(true);
});

// get some Transactions, Auth, and Balance data from the Plaid API
app.get("/api/data", async (req, response, next) => {
  const access_token = req.session.access_token;
  const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
  const endDate = moment().format("YYYY-MM-DD");

  const transactionsResponse = await client.transactionsGet({
    start_date: startDate,
    end_date: endDate,
    access_token,
  });

  const authResponse = await client.authGet({ access_token });

  const balanceResponse = await client.accountsBalanceGet({ access_token });
  response.json({
    Transactions: transactionsResponse.data,
    Auth: authResponse.data,
    Balance: balanceResponse.data,
  });
});

app.listen(process.env.PORT || 8080);
