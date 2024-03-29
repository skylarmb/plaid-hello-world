import React, { useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

import "./App.scss";

function App() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const onSuccess = useCallback(async (publicToken) => {
    setLoading(true);
    const response = await fetch("/api/exchange_public_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token: publicToken }),
    });

    await getBalance();
  }, []);

  const createLinkToken = React.useCallback(async () => {
    const response = await fetch("/api/create_link_token", {});

    const data = await response.json();
    setToken(data.link_token);
  }, [setToken]);

  const getBalance = React.useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/balance", {});

    const data = await response.json();
    setData(data);
    setLoading(false);
  }, [setData, setLoading]);

  // check if we already connected an item
  const getStatus = React.useCallback(async () => {
    const response = await fetch("/api/is_account_connected", {});
    const data = await response.json();
    if (data.status === true) {
      // we already have an item, get balance
      await getBalance();
    } else {
      // otherwise create a link token so we can connect an item
      await createLinkToken();
    }
    setLoading(false);
  }, [getBalance, setLoading, createLinkToken]);

  // get status on app load, which either creates a link token or gets balance
  React.useEffect(() => {
    getStatus();
  }, [getStatus]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <div>
      {!loading && data == null && (
        <button onClick={() => open()} disabled={!ready}>
          Link account
        </button>
      )}

      {!loading &&
        data != null &&
        Object.entries(data).map((entry, i) => (
          <pre key={i}>
            <code>{JSON.stringify(entry[1], null, 2)}</code>
          </pre>
        ))}
    </div>
  );
}

export default App;
