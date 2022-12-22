const { default: axios } = require("axios");
const ApiUrl = require("./api_url");
const KiotvietToken = require("../common/kiotviet_token");
const mongoCategory = require("../models/mongo/mongo.category")
const mongoProduct = require("../models/mongo/mongo.product")
const mongoAttribute = require("../models/mongo/mongo.attribute")
const mongoAttributeValue = require("../models/mongo/mongo.attribute_value")
const mongoProductAttribute = require("../models/mongo/mongo.product_attribute");
const kiotVietApi = require("./kiotviet_api")
const {mongoProductFromKiotVietProduct} = require('./functions');
const { category } = require("../controllers/admin_controller");

async function importCategories() {
    let params = {
        hierachicalData: true
    }
    let accessToken = await KiotvietToken.token();
    let response = await axios({
        method: "get",
        url: ApiUrl.getAllCategory(),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Retailer: process.env.RETAILER
        },
        // params: params

    }).then(response => response.data);
    response.data.forEach(category=> {
        mongoCategory.findOne({
            _id: category.categoryId
        }).then(res=> {
            if (res == null) {
                mongoCategory.create({
                    _id: category.categoryId,
                    categoryName: category.categoryName,
                    parentId: 0
                })
            }
        })
        
        let childrens = category.children;
        if (category.hasChild)
        childrens.forEach(child => {
            mongoCategory.findOne({
                _id: child.categoryId
            }).then(res=> {
                if (res==null) {
                    mongoCategory.create({
                        _id: child.categoryId,
                        categoryName: child.categoryName,
                        parentId: child.parentId,
                    }).then(res => console.log(res))
                    if (child.hasChild) {
                        let childrens = child.children;
                        childrens.forEach(child => {
                            mongoCategory.findOne({
                                _id: child.categoryId,
                            }).then (res=> {
                                if (res==null) {
                                    mongoCategory.create({
                                        _id: child.categoryId,
                                        categoryName: child.categoryName,
                                        parentId: child.parentId,
                                    }).then(res => console.log(res))
                                }
                            })
                            
                        })
                    }
                }
            })
            
        })
    })
}
async function importAttributes() {
    try {
        let accessToken = await KiotvietToken.token();
        let attributes = await axios({
            method: "get",
            url: ApiUrl.getAttributes,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: process.env.RETAILER
            },
        })
        for (let attribute of attributes.data) {
           await  mongoAttribute.create({
                _id: attribute.id,
                name: attribute.name
            });
            for (let attributeValue of attribute.attributeValues) {
                mongoAttributeValue.create({
                    attributeId: attribute.id,
                    value: attributeValue.value
                }).then(res=>console.log(res));
            }
        }
    } catch (e) {
        console.log(e);
     };
}
async function importProduct() {
    try {
        let pageSize = 100;
        let total = 1;
        let page = 1
        let url = ApiUrl.getProducts
        while (page <= total) {
            let response = await kiotVietApi.callApi(url, { params: { currentItem: (page - 1) * pageSize, pageSize: pageSize, includePricebook: true, includeInventory: true, } })
            total = Math.floor(parseInt(response.data.total) / 100) + 1
            page += 1;
            // add to mongo db
            let products = response.data.data;
            for (let product of products) {
                let mongoPr = mongoProductFromKiotVietProduct(product);
                mongoPr.isSynced = false;
                await mongoProduct.create(mongoPr);
                //TODO: 
                if (product.attributes != null)
                    for (let attribute of product.attributes) {
                        let resAttribute = await mongoAttribute.findOne({
                            name: attribute.attributeName
                        })
                        let resValue = await mongoAttributeValue.findOne({
                            attributeId: resAttribute._id,
                            value: attribute.attributeValue
                        })
                        if (resValue == null) {
                            resValue = await mongoAttributeValue.create({
                                attributeId: resAttribute._id,
                                value: attribute.attributeValue
                            })
                        }
                        await mongoProductAttribute.create({
                            productId: product.id,
                            attributeValueId: resValue._id
                        })
                    }
            }
            console.log(`importing page ${page} of ${total} pages`)

        }
    } catch (err) {
        console.log(err);

    }
    
    
}

module.exports.importCategories = importCategories
module.exports.importAttributes = importAttributes
module.exports.importProduct = importProduct