const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const AppString = require('./app_string')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function hashPassword(plainTextPassword) {
    let password = await bcrypt.hash(plainTextPassword, 10)
    return password
}
function readableDoc(doc, ...needRemoveKey) {
    const { password, __v, ...rest } = doc
    needRemoveKey.forEach(key => delete rest[key])
    return rest
}
function editableField(doc) {
    try {
        const { password, __v, createAt, updatedAt, _id, ...rest } = doc
    return rest
    } catch (error) {
        throw AppString.invalidRequestBody
    }
}
function baseRespond(success, message, data) {
    return {
        'success': success,
        'message': message,
        'data': data
    }
}
function findTable(tableName) {
    let targetTable = mongoose.models[tableName];
    if (targetTable == null) throw AppString.tableNotFound
    return targetTable
}
function generateJWT(user) {
    let accessToken = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role

        },
        process.env.JWT_SECRET
    )
    return accessToken;
}
function isValidateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
function getQueryString(req) {
    let query = req._parsedOriginalUrl.query ?? ''
    if (query.length > 0) {
        let ls = query.split('&')
        ls = ls.filter((item) => !item.includes('page'))
        query = ls.join('&')
    }
    return query
}

function removeAccent(str) { // Translate all accent characters to English characters
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
function removeNullKey (m) {
    for (key in m) {
        if (m[key] == null) {
            delete m[key]
        }
    }
    return m
}
function toPathString(s) {
   s = s.toLowerCase();
   s = s.replace(/ /g, "-");
   return s
}

function isVietnamesePhoneNumber(number) {
    return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(number);
  }

module.exports.removeAccent = removeAccent
module.exports.isVietnamesePhoneNumber   = isVietnamesePhoneNumber    
module.exports.hashPassword = hashPassword
module.exports.readableDoc = readableDoc
module.exports.baseRespond = baseRespond
module.exports.findTable = findTable
module.exports.editableField = editableField
module.exports.generateJWT = generateJWT
module.exports.isValidateEmail = isValidateEmail
module.exports.getRndInteger = getRndInteger
module.exports.removeNullKey =removeNullKey
module.exports.getQueryString = getQueryString
module.exports.toPathString = toPathString
