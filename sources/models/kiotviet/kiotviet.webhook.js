const { default: axios } = require("axios");
const ApiUrl = require("../../common/api_url");
const KiotvietToken = require("../../common/kiotviet_token");
var qs = require('qs');
const KiotvietAPI = require("../../common/kiotviet_api");
const { baseRespond } = require("../../common/functions");

class KiotVietWebhook {
    // Get all webhooks
    static async getAllWebhooks() {
        try {
            let url = ApiUrl.getAllWebhooks;
            let response = await KiotvietAPI.callApi(url)
            return response
        } catch (err) {
            console.log(err)
            return baseRespond(false, err)
        }
    }
    static async deleteWebhook(id) {
        try {
            let url = ApiUrl.deleteWebhookById(id)
            let response = await KiotvietAPI.callApi(url, { method: "DELETE" })
            return response;
        } catch (err) {
            console.log(err);
            return baseRespond(false, err)
        }
    }
    static async registWebhook(type) {
        if (type == 'stock.update') 
            return await KiotVietWebhook.registUpdateOnhand();
        if (type == 'product.update')
            return await KiotVietWebhook.registUpdateProduct();
        if (type == 'product.delete')
            return await KiotVietWebhook.registDeleteProduct();
    }
    static async registUpdateProduct() {
        try {
            let url = ApiUrl.registerWebhook;
            let body = {
                "Webhook": {
                    "Type": "product.update",
                    "Url": "https://tuansportdanang.com/webhook/update-product",
                    "IsActive": true,
                    "Description": "This is the Webhook that update product"
                }
            }
            let response = await KiotvietAPI.callApi(url, { method: "POST", body })
            return response;
        } catch (err) {
            console.log(err);
            return baseRespond(false, err)
        }
    }
    static async registUpdateOnhand() {
        try {
            let url = ApiUrl.registerWebhook;
            let body = {
                "Webhook": {
                    "Type": "stock.update",
                    "Url": "https://tuansportdanang.com/webhook/update-onhand",
                    "IsActive": true,
                    "Description": "This is the Webhook that update on hand of the product"
                }
            }
            let response = await KiotvietAPI.callApi(url, { method: "POST", body })
            return response;
        } catch (err) {
            console.log(err);
            return baseRespond(false, err)
        }
    }
    static async registDeleteProduct() {
        try {
            let url = ApiUrl.registerWebhook;
            let body = {
                "Webhook": {
                    "Type": "product.delete",
                    "Url": "https://tuansportdanang.com/webhook/delete-product",
                    "IsActive": true,
                    "Description": "This is the Webhook that delete product"
                }
            }
            let response = await KiotvietAPI.callApi(url, { method: "POST", body })
            return response;
        } catch (err) {
            console.log(err);
            return baseRespond(false, err)
        }
    }
}
module.exports = KiotVietWebhook;