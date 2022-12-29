const axios = require('axios');
var qs = require('qs');
let ApiUrl = require('./api_url');
const { baseRespond } = require('./functions');

class KiotvietAPI {
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
        KiotvietAPI.accessToken = data.access_token;
      })
      .catch(function (error) {
        console.log(error);
      });

  }
 static async token() {
    if (KiotvietAPI.accessToken != '')
      return KiotvietAPI.accessToken;
    else {
      await KiotvietAPI.getAccessToken();
      return KiotvietAPI.accessToken;

    }

  }
  static async callApi(url, {method = 'get',body,params = {},headers = {}} = {}) {
    try {
        let accessToken = await KiotvietAPI.token();
        let response = await axios({
            method: method,
            url:url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: process.env.RETAILER,
                ...headers
            },
            data: body,
            params:params
        })
        return response.data;
    } catch (e) {
        console.log(e);
        return baseRespond(false,e)
     };
}
}
module.exports = KiotvietAPI;