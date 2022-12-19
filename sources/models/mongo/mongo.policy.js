const mongoose = require('mongoose');
const AppString = require('../../common/app_string');
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Policy = new Schema({
    name: { type: String, required: true, },
    images: { type: String, default: ''},
    description: { type: String, required: true,},
    htmlString: { type: String, },
    slug : { type: String, slug: "name", unique: true},
}, {
    timestamps: true,
}, { collection: 'users' }
);


module.exports = mongoose.model('Policy', Policy);