const { json, response } = require("express");
const AppString = require("../common/app_string");
const { isValidateEmail, baseRespond, generateJWT } = require("../common/functions");
const { getTableDataWithPagination } = require("../common/pagination");
const mongoUser = require("../models/mongo/mongo.user")
const mongoProduct = require("../models/mongo/mongo.product")

class HomeController {
    // GET 
    async home (req,res) {
        // res.json(req.headers.userInfor)
        let { docs } = await getTableDataWithPagination(req,mongoProduct, {findCondition : {
            masterProductId : null,
            isSynced : true

        }})
        res.render("home/home", {
            data: docs
        })
    }

    async wishlist(req,res) {
        res.render("wishlist/wishlist")
    }
}

module.exports = new HomeController();