const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductAttribute = new Schema({
    // _id: {type:Number,required:true},
    productId: {type:Number,required:true,ref : 'Product'},
    attributeValueId: {type:ObjectId,required:true,ref : 'AttributeValue'},
}, {
    timestamps: true,
}, { collection: 'productAttributes' }
);


module.exports = mongoose.model('ProductAttribute', ProductAttribute);