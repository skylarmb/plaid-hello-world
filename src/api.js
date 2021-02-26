export const createLinkToken = async () => {
  const response = await fetch("/api/create_link_token", {
    method: "GET",
  });
  const data = await response.json();

  return data.link_token;
};

export const exchangePublicToken = async (publicToken) => {
  await fetch("/api/exchange_public_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_token: publicToken }),
  });
};

export const getTransactions = async () => {
  const response = await fetch("/api/data", {
    method: "GET",
  });
  const data = await response.json();
  return data;
};
