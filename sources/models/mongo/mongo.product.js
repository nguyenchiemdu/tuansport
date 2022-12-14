const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema({
    _id: {type:Number,required:true},
    masterProductId: {type:Number,default:null},
    name: { type: String, required: true, },
    fullName: { type: String, required: true, },
    skuCode: { type: String, required: true },
    price: { type: Number, required: true },
    ctvPrice: { type: Number, required: true },
    salePrice: { type: Number,default:null},
    images: { type: Array, required: true },
    categoryId : {type: Number,required: true, ref: 'Cagetory'},
    size: { type: String, required: true },
    isSynced: { type: Boolean, required: true,default: true},
    color: { type: String },
    tag: { type: String, default: ''},
}, {
    timestamps: true,
}, { collection: 'products' }
);


module.exports = mongoose.model('Product', Product);