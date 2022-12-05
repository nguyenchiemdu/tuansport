const { default: axios } = require("axios");
const ApiUrl = require("../../common/api_url");
const KiotvietToken = require("../../common/kiotviet_token");
const mongoCategory = require("../mongo/mongo.category")
var qs = require('qs');

class KiotVietOrder {
    // Creater order
    static async createOrder(customerName, contactNumber, address, email, listProduct,bankPayment, { params = [] } = {}) {
        try {
            let description ='Đơn hàng từ website.';
            if (bankPayment) {
                description+= ' Chuyển khoản ngân hàng.'
            }
            let accessToken = await KiotvietToken.token();
            let response = await axios({
                method: "post",
                url: ApiUrl.createOrder,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Retailer: process.env.RETAILER,
                    Partner: 'MyKiot'
                },
                params: params,
                data: {
                    "branchId": 79503,
                    "soldById": 233260,
                    "totalPayment": 0.0000,
                    "discount": 0.0000,
                    "status": 1,
                    "statusValue": "Draft",
                    "description": description,
                    "orderDelivery": {
                     
                        "receiver":customerName,
                        "contactNumber": contactNumber,
                        "address": address,
                    },
                    "SaleChannelId": 169622,
                    "PriceBookId": 0,
                    "orderDetails": [...listProduct
                        // {
                        //     "productCode": "SP505082",
                        //     "quantity": 1
                        // }
                    ],
                    "customer": {
                        "name": customerName,
                        "contactNumber": contactNumber,
                        "address": address,
                        "email": email
                    }
                }

            }).then(response => response.data);
            return response;
        } catch (err) {
            console.log(err.data)
            return null
        }
    }
}
module.exports = KiotVietOrder;