const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Attribute = new Schema({
    _id: {type:Number,required:true},
    name: {type:String,required:true}
}, {
    timestamps: true,
}, { collection: 'attributes' }
);


module.exports = mongoose.model('Attribute', Attribute);