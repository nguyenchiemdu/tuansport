const axios = require('axios');
var qs = require('qs');
let ApiUrl = require('./api_url');

class KiotvietToken {
  static accessToken = '';
  static async getAccessToken() {
    var data = qs.stringify({
      'scopes': 'PublicApi.Access',
      'grant_type': 'client_credentials',
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET
    });
    var config = {
      method: 'post',
      url: ApiUrl.accessToken,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    await axios(config)
      .then(function (response) {
        data = response.data;
        KiotvietToken.accessToken = data.access_token;
      })
      .catch(function (error) {
        console.log(error);
      });

  }
 static async token() {
    if (KiotvietToken.accessToken != '')
      return KiotvietToken.accessToken;
    else {
      await KiotvietToken.getAccessToken();
      return KiotvietToken.accessToken;

    }

  }
}
module.exports = KiotvietToken;