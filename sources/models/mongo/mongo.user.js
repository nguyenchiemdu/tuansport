const mongoose = require('mongoose');
const AppString = require('../../common/app_string');

const Schema = mongoose.Schema;

const User = new Schema({
    role : { type:String,default :  AppString.ctv},
    username: { type: String, required: true, },
    password: { type: String, required: true, },
    isActive : { type: Boolean, default : true },
}, {
    timestamps: true,
}, { collection: 'users' }
);


module.exports = mongoose.model('User', User);