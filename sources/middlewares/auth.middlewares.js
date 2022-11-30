require('dotenv').config()
const jwt = require("jsonwebtoken")
const AppString = require('../common/app_string')
const { baseRespond } = require('../common/functions')
class AuthMiddleware {
    async authenticateUser(req, res, next) {
        //Check token
        req.headers['userInfor'] = null;
        let payload
        try {

            let accessToken = req.cookies.token
            payload = jwt.verify(accessToken, process.env.JWT_SECRET)
            req.headers['userInfor'] = payload;
            // req.body.email = payload.email
            // req.body.id = payload.id
            // req.body.loginType = payload.loginType
            // req.body.role = payload.role
            next()
        }
        catch (error) {
            // console.log(AppString.invalidAccessToken)
            next()
        }

    }
    checkPermission(req, res, next) {
        if (req.headers['userInfor']?.role == 'Admin') {
            next()
        } else {
            res.status(400)
            next(AppString.noPermission)
        }
    }
}

module.exports = new AuthMiddleware()
