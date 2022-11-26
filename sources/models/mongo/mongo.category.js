const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cagetory = new Schema({
    _id: { type: Number,required: true},
    parentId: { type: Number},
    categoryName: { type: String, required: true, },
}, {
    timestamps: true,
}, { collection: 'categories' }
);


module.exports = mongoose.model('Cagetory', Cagetory);