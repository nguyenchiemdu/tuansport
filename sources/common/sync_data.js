const { default: axios } = require("axios");
const ApiUrl = require("./api_url");
const KiotvietToken = require("../common/kiotviet_token");
const mongoCategory = require("../models/mongo/mongo.category")
const mongoAttribute = require("../models/mongo/mongo.attribute")
const mongoAttributeValue = require("../models/mongo/mongo.attribute_value")

async function importCategories(categoryId) {
    let params = {
        hierachicalData: true
    }
    let accessToken = await KiotvietToken.token();
    let response = await axios({
        method: "get",
        url: ApiUrl.getCategoryById(categoryId),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Retailer: process.env.RETAILER
        },
        params: params

    }).then(response => response.data);
    mongoCategory.create({
        _id: response.categoryId,
        categoryName: response.categoryName,
        parentId: 0
    })
    let childrens = response.children;
    childrens.forEach(child => {
        mongoCategory.create({
            _id: child.categoryId,
            categoryName: child.categoryName,
            parentId: child.parentId,
        }).then(res => console.log(res))
        if (child.hasChild) {
            let childrens = child.children;
            childrens.forEach(child => {
                mongoCategory.create({
                    _id: child.categoryId,
                    categoryName: child.categoryName,
                    parentId: child.parentId,
                }).then(res => console.log(res))
            })
        }
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

module.exports.importCategories = importCategories
module.exports.importAttributes = importAttributes