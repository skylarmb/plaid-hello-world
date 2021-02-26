# plaid-hello-world

The [Plaid Quickstart](https://github.com/plaid/quickstart) is a great full-featured demo of the Plaid API in many languages, but its quite complex.
This is a much smaller example of using `react-plaid-link` and `plaid-node`.

## Setup

```shell
cp .env.example .env # fill out values in .env
yarn
```

## Run

```shell
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The API runs on [http://localhost:8080](http://localhost:8080)

The react frontend and the node server will hot-reload if you make edits.

## The code

Frontend code is in `src/App.jsx` and `src/api.js`. Backend code is in `server.js`

## Notes:

There is no error handling code anywhere, and some important TODOs
