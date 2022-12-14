const { json, response } = require("express");
const AppString = require("../common/app_string");
const { isValidateEmail, baseRespond, generateJWT } = require("../common/functions");
const { getTableDataWithPagination } = require("../common/pagination");
const mongoUser = require("../models/mongo/mongo.user")
const mongoProduct = require("../models/mongo/mongo.product");
const mongoCategory = require("../models/mongo/mongo.category");
const mongoNavbarcategories = require("../models/mongo/mongo.navbarcategories");

class HomeController {
    // GET 
    async home(req, res) {
        // res.json(req.headers.userInfor)
        let { docs } = await getTableDataWithPagination(req, mongoProduct, {
            findCondition: {
                masterProductId: null,
                isSynced: true

            }
        })
        let html = (await mongoNavbarcategories.findById(1)).string
        res.render("home/home", {
            data: docs,
            user: req.headers.userInfor,
            html: html,
        })
    }
    async cart(req, res) {
        res.render('cart/cart', { user: req.headers.userInfor })
    }
    async wishlist(req, res) {
        res.render("wishlist/wishlist", { user: req.headers.userInfor })
    }
    async checkout(req, res) {
        res.render("checkout/checkout", { user: req.headers.userInfor})
    }
}

module.exports = new HomeController();