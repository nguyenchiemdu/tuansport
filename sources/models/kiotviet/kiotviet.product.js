const { default: axios } = require("axios");
const ApiUrl = require("../../common/api_url");
const KiotvietToken = require("../../common/kiotviet_token");
var qs = require('qs');

class KiotVietProduct {
    // Get products
    static async getProducts(params) {
        try {
            let accessToken = await KiotvietToken.token();
            let response = await axios({
                method: "get",
                url: ApiUrl.getProducts,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Retailer: process.env.RETAILER
                },
                params: params

            }).then(response => response.data)
            return response;
        } catch (err) { 
            console.log(err)
            throw err
        }
    }
}
module.exports = KiotVietProduct;