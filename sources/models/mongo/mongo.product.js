const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, required: true, },
    fullName: { type: String, required: true, },
    skuCode: { type: String, required: true },
    price: { type: Number, required: true },
    ctvPrice: { type: Number, required: true },
    images: { type: Array, required: true },
    categoryId : {type: Number,required: true, ref: 'Category'},
}, {
    timestamps: true,
}, { collection: 'products' }
);


module.exports = mongoose.model('Product', Product);