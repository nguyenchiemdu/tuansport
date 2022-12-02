const { json, response } = require("express");
const AppString = require("../common/app_string");
const { isValidateEmail, baseRespond, generateJWT } = require("../common/functions");
const mongoUser = require("../models/mongo/mongo.user")

class AuthController {
    // GET 
    async login (req,res) {
        if (req.headers['userInfor']!= null) 
            res.redirect('/')
        else
        res.render("login/login")
    }
    // POST
    async authentication(req,res,next) {
        try {
            // Authentication 
            var ctv = await mongoUser.findOne({ username: req.body.username }) // Check username is existed 
                if (!ctv) return res.json(baseRespond(false, AppString.invalidEmailPass))

            var isRightPassword = await req.body.password == ctv.password // Check password 
                if (!isRightPassword) {
                    return res.json(baseRespond(false, AppString.invalidEmailPass))
                }

            if (ctv.isActive != true) { // Check ctv is active or not 
                return res.json(baseRespond(false, AppString.accountLocked))
            }

            res.status(200)
            //Create JWT
            const accessToken = generateJWT(ctv) // Generate JWT
            let response = baseRespond(true, AppString.ok, {
                // ...userInfor(user._doc),
                'token': accessToken
            })
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }
    //GET 
    async signout(req,res,next) {
        // Clear cookie 
        res.clearCookie('token')
        res.redirect('/login')
    }
}

module.exports = new AuthController();