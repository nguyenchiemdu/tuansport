const { default: axios } = require("axios");
const ApiUrl = require("../../common/api_url");
const KiotvietToken = require("../../common/kiotviet_token");
const mongoCategory = require("../mongo/mongo.category")
var qs = require('qs');
const KiotvietAPI = require("../../common/kiotviet_api");

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
    static async getAllCategory() {
       let response =  await KiotvietAPI.callApi(ApiUrl.getAllCategory())
       let {total,data} = response.data;
       return data;
    }
    static modifyCategoryToTree (refCategory,selectedId) {
        let isExpanded = false;

        refCategory.text = refCategory.categoryName
        if (refCategory.categoryId == selectedId) {
        refCategory.class = 'category-item selected'
            isExpanded = true;
        } else {
        refCategory.class = 'category-item'
        }
        
            refCategory.id = refCategory?.categoryId || refCategory?._id
        if (refCategory.children!= null) {
            refCategory.nodes = [...refCategory.children]
            refCategory.icon =  "fa fa-folder"
            for (let i = 0; i < refCategory.nodes.length; i++) {
                
                if(!isExpanded) isExpanded =  KiotVietCategory.modifyCategoryToTree(refCategory.nodes[i],selectedId)
                else KiotVietCategory.modifyCategoryToTree(refCategory.nodes[i])
            }
            refCategory.expanded = isExpanded;
            return isExpanded
        }
        return isExpanded
    }
}
module.exports = KiotVietCategory;