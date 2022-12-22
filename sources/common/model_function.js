const KiotvietAPI = require('./kiotviet_api')
const ApiUrl = require('./api_url')
const mongoCategory = require('../models/mongo/mongo.category')
const KiotVietCategory = require('../models/kiotviet/kiotvet.category')
const mongoProduct = require('../models/mongo/mongo.product')
async function updateSizeToCategory(listSize,parentId,isAdd) {
    try {
        // let res = await KiotvietAPI.callApi(ApiUrl.getProductById(resProduct._id))
                while (parentId != null) {
                    let category = await mongoCategory.findById(parentId)
                    if (category != null) {
                        let currentSizes = new Set(category.listSize);

                        if (isAdd) {
                            // add new sizes in to list
                            listSize.forEach(size => {
                                currentSizes.add(size)
                            });
                            
                        } 
                        currentSizes =Array.from(currentSizes)
                        // else {
                        //     // remove new sizes out of list
                        //     currentSizes = currentSizes.filter(size=> !listSize.includes(size))
                        // }
                        await mongoCategory.updateOne({
                            _id: parentId
                        }, {
                            $set: { listSize: currentSizes }
                        })
                    }
                    parentId = category?.parentId
                }
    } catch (error) {
        console.log(error)
    }
}
module.exports.updateSizeToCategory = updateSizeToCategory
