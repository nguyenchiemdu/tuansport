const { json, response } = require("express");
const AppString = require("../common/app_string");
const { isValidateEmail, baseRespond, generateJWT } = require("../common/functions");
const mongoUser = require("../models/mongo/mongo.user")

class LoginController {
    // GET 
    async home (req,res) {
        res.json(req.headers.userInfor)
        // res.render("home/home")
    }
}

module.exports = new LoginController();