const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NavbarCategories = new Schema({
    _id: { type: Number,required: true},
    string: { type: String, default: ''}
}, {
    timestamps: true,
}, { collection: 'navbarCategories' }
);


module.exports = mongoose.model('NavbarCategories', NavbarCategories);