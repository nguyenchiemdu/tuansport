const mongoose = require('mongoose');
const AppString = require('../../common/app_string');

const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, required: true, },
    skuCode: { type: String, required: true },
    price: { type: Number, required: true },
    ctvPrice: { type: Number, required: true },
    images: { type: Array, required: true }
}, {
    timestamps: true,
}, { collection: 'products' }
);


module.exports = mongoose.model('Product', Product);