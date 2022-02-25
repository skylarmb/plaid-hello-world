import React, { useEffect, useState} from 'react';
import App from './App';

const OAuth = () => {
  console.log(App);
  console.log("sadkahsdhsadhada");
  const [token, setToken] = useState(null);

  // The Link token from the first Link initialization
  const linkToken = localStorage.getItem('link_token');

  // automatically reinitialize Link
  useEffect(() => {
    if (linkToken != null) {
      setToken(linkToken);
    }
  }, [linkToken]);

  return (
    <>
      {token != null && (
        <App 
          isOauth
        />
      )}
    </>
  );
};

export default OAuth;