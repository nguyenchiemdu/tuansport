const KiotvietAPI = require('./kiotviet_api')
const ApiUrl = require('./api_url')
const mongoCategory = require('../models/mongo/mongo.category')
const KiotVietCategory = require('../models/kiotviet/kiotvet.category')
const mongoProduct = require('../models/mongo/mongo.product')
const AppString = require('./app_string')
async function updateSizeToCategory(listSize,parentId,isAdd) {
    try {
        // let res = await KiotvietAPI.callApi(ApiUrl.getProductById(masterProduct._id))
                while (parentId != null) {
                    let category = await mongoCategory.findById(parentId)
                    if (category != null) {
                        let currentSizes = new Set(category.listSize);
                        currentSizes.delete(null)
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
async function updateMasterProduct(masterProductId) {
    let masterProduct = await mongoProduct.findOne({_id : masterProductId})
    let listSize = []
    if (masterProduct!= null) {
        let totalOnHand = masterProduct.onHand;
                 {
                    if (masterProduct.size!= null && parseInt(masterProduct.onHand)>0) listSize.push(masterProduct.size)
                    let subProducts = await mongoProduct.find({
                        masterProductId: masterProductId,
                    })
                    subProducts.forEach(product => {
                        if (parseInt(product.onHand)>0) {
                            if (product.size!= null) listSize.push(product.size)
                            totalOnHand += product.onHand
                        }
                    });
                }
                listSize = Array.from(new Set(listSize));
                response = await mongoProduct.updateOne({ _id: masterProductId }, {
                    $set: {listSize: listSize, totalOnHand: totalOnHand }
                })
    } else {
        console.error('Master product not found')
    }
    
}
async function mapRangePrice(products,req) {
    let userInfor = req.headers.userInfor;
    if (products.at(0)?._doc!= null)
    products = products.map(product =>product._doc)
    products = await Promise.all(products.map(async (product) =>{
       let prices = await mongoProduct.find({masterProductId: product._id})
                            .then(products => products.map(product=>{
                                if (userInfor?.role == AppString.ctv) {
                                  return  parseInt(product.ctvPrice)
                                } else {
                                  return  parseInt(product.price)
                                }
                            }));
            prices.push(parseInt(product.price));
            product.minPrice = Math.min(...prices)
            product.maxPrice = Math.max(...prices)
            return product;
    }));
    return products;
}
module.exports.updateSizeToCategory = updateSizeToCategory
module.exports.updateMasterProduct = updateMasterProduct
module.exports.mapRangePrice = mapRangePrice
