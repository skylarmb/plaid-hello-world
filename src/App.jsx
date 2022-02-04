import Button from "plaid-threads/Button";
import CodeBlockHighlighted from "plaid-threads/CodeBlockHighlighted";
import React, { useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import * as api from "./api";

import "./App.scss";

function App() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const createToken = useCallback(async () => {
    const linkToken = await api.createLinkToken();
    setToken(linkToken);
    setLoading(false);
  }, []);

  const onSuccess = useCallback(async (publicToken) => {
    setLoading(true);
    await api.exchangePublicToken(publicToken);
    const data = await api.getTransactions();
    setData(data);
    setLoading(false);
  }, []);

  // generate link token on app load
  React.useEffect(() => {
    createToken();
  }, [createToken]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <div className="App">
      <h3>Plaid Hello World</h3>
      {loading && <div className="spinner"></div>}

      {!loading && data == null && (
        <Button onClick={() => open()} disabled={!ready}>
          Link account
        </Button>
      )}

      {!loading &&
        data != null &&
        Object.entries(data).map((entry, i) => (
          <CodeBlockHighlighted
            key={i}
            title={entry[0]}
            code={JSON.stringify(entry[1], null, 2)}
            lang="json"
            className="codeblock"
          />
        ))}
    </div>
  );
}

export default App;
