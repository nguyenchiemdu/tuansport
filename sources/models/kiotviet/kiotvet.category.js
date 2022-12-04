const { default: axios } = require("axios");
const ApiUrl = require("../../common/api_url");
const KiotvietToken = require("../../common/kiotviet_token");
const mongoCategory = require("../mongo/mongo.category")
var qs = require('qs');

class KiotVietCategory {
    // Get products
    static async getCategoryById(id,{params = []}= {}) {
        try {
            let accessToken = await KiotvietToken.token();
            let response = await axios({
                method: "get",
                url: ApiUrl.getCategoryById(id),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Retailer: process.env.RETAILER
                },
                params: params

            }).then(response => response.data);
            return response;
        } catch (err) { 
            // console.log(err)
            return null
        }
    }
}
module.exports = KiotVietCategory;