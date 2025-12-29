const jsencrypt = require('jsencrypt');
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2S2mwjXMhRrdy5CwbEu9
ge3D/V/4W+R55x7LTyti6ZetuNMxa3Z0YjnHBmE5PazD8EBdW7nanxKCjVVY4Bvk
J4cmKXsY5dW33P3xvepGg5aK6Q/Db2NhAJKMi7F+bziLS8k+/QeNeZs5gVwLQ+UV
94FsE/rQlA3KmYLvihyt/gTqF9njOgzH+wrl+RiJHEdGtoouXypgZfve0EdBog2M
dvobUaWq7IPv9ew6taKDug8SpDnOds7XjgEOwjMNxboPFPtGa2bRRwlXw9872Vtn
FtcRSrylHiW1NjguQXngJXdj3fH34BRaOVlsLkejjNMupuTubYBBiPrmL5wIVyYn
DQIDAQAB
-----END PUBLIC KEY-----`;

const loginUrl = "https://api.production4ig.opentv.com/ags/signOn"
const crypter = new jsencrypt();
crypter.setPublicKey(publicKey);

const login = async (email, password) => {
  const encryptedPassword = crypter.encrypt(password);
  const headers = {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'hu_HU',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'DNT': '1',
          'Expires': '0',
          'Nagra-Device-Type': 'Browser',
          'Nagra-Target': 'tv',
          'NV-Tenant-Id': 'nagra',
          'Origin': 'https://www.one-tv.hu',
          'Pragma': 'no-cache',
          'Priority': 'u=1, i',
          'Referer': 'https://www.one-tv.hu/',
          'Sec-CH-UA': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
          'Sec-CH-UA-Mobile': '?0',
          'Sec-CH-UA-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          'X-Auth-Service-Id': '4iGSSO'
      };
  const loginParams = {
      "parameters":[
          {"name":"username","value":email},
          {"name":"password","value":encryptedPassword},
      ],
      "clientId":"68ed45f253c2461d5dad764b"
  }
  //console.log("Login params: ", loginParams);

  const response = await fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify(loginParams),
      headers: headers
  });

  return await response.json();
};

module.exports = login;