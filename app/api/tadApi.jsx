const getTDXAuthToken = async () => {
  const parameter = {
    grant_type: "client_credentials",
    client_id: "n36071413-b04a1e7b-6851-40e1",
    client_secret: "d1773434-263b-4cc5-aa71-a5f26227a428",
  };

  try {
    const response = await fetch(
      "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Accept-Encoding": "br,gzip",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(parameter),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    throw error;
  }
};

const getAirlineData = async (accessToken) => {
  try {
    const response = await fetch(
      "https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/TPE?%24top=30&%24format=JSON",
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
          "Accept-Encoding": "br,gzip",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching train delay data:", error);
    throw error;
  }
};

export { getTDXAuthToken, getAirlineData };
