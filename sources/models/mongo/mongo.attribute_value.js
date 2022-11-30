const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AttributeValue = new Schema({
    // _id: {type:Number,required:true},
    attributeId: {type:Number,required:true,ref: 'Attribute'},
    value: {type:String,required:true},
}, {
    timestamps: true,
}, { collection: 'attributevalues' }
);


module.exports = mongoose.model('AttributeValue', AttributeValue);