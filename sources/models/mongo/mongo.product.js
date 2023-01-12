const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema({
    _id: {type:Number,required:true},
    masterProductId: {type:Number,default:null},
    name: { type: String, required: true, },
    fullName: { type: String, required: true, },
    skuCode: { type: String, required: true },
    price: { type: Number, required: true },
    ctvPrice: { type: Number, default:null},
    salePrice: { type: Number,default:null},
    images: { type: Array, required: true },
    categoryId : {type: Number,required: true, ref: 'Cagetory'},
    size: { type: String },
    listSize: { type: Array},
    isSynced: { type: Boolean, required: true,default: true},
    color: { type: String },
    tags: { type: Array, default: []},
    onHand: {type: Number},
    reserved : {type: Number,default: 0},
    totalReserved : {type: Number,default:0},
    totalOnHand: {type: Number},
    description: {type: String, default: ''},
    long_description: {type: String, default: ''},
    isMarked: {type: Boolean, default: false},
    comebackDate : {type:Date}
}, {
    timestamps: true,
}, { collection: 'products' }
);


module.exports = mongoose.model('Product', Product);