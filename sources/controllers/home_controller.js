const { json, response } = require("express");
const AppString = require("../common/app_string");
const { isValidateEmail, baseRespond, generateJWT } = require("../common/functions");
const { getTableDataWithPagination } = require("../common/pagination");
const mongoUser = require("../models/mongo/mongo.user")
const mongoProduct = require("../models/mongo/mongo.product");
const mongoCategory = require("../models/mongo/mongo.category");
const mongoNavbarcategories = require("../models/mongo/mongo.navbarcategories");
const mongoPolicy = require("../models/mongo/mongo.policy");

class HomeController {
    // GET 
    async home(req, res) {
        // res.json(req.headers.userInfor)
        let { docs } = await getTableDataWithPagination(req, mongoProduct, {
            findCondition: {
                masterProductId: null,
                isSynced: true,
                totalOnHand : { $gt: 0 }

            }
        })
        let { docs: newestProduct } = await getTableDataWithPagination(req, mongoProduct, {
            sortCondition:'-updatedAt',
            findCondition: {
                masterProductId: null,
                isSynced: true,
                totalOnHand : { $gt: 0 }
            }
        })

        let {docs: newsFeed} = await getTableDataWithPagination(req, mongoPolicy, {
            sortCondition: "-updatedAt",
            totalOnHand : { $gt: 0 }
        })
        
        res.render("home/home", {
            data: docs,
            newestProduct,
            newsFeed,
            user: req.headers.userInfor,
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
    async policy(req,res) {
        let slug = req.params.slug
        let page = await mongoPolicy.findOne({slug: slug}).exec()
        let {docs: newsFeed} = await getTableDataWithPagination(req, mongoPolicy, {
            sortCondition: "-updatedAt",
            totalOnHand : { $gt: 0 }
        })
        let relatedNewsFeed
        if (newsFeed) {
            relatedNewsFeed = await newsFeed.filter(news => news.slug != page.slug)
        }
        let url = req.hostname + '/' + req.originalUrl
        res.render("policy/policy", { user: req.headers.userInfor, page: page, relatedNewsFeed: relatedNewsFeed, url: url })
    }
}

module.exports = new HomeController();