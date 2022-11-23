require('dotenv').config()
const jwt = require("jsonwebtoken")
const AppString = require('../common/app_string')
const { baseRespond } = require('../common/functions')
class AuthMiddleware {
    async authenticateUser(req, res, next) {
        //Check token
        let payload
        try {
        let accessToken = req.headers['authorization'].split(' ')[1]
            payload = jwt.verify(accessToken, process.env.JWT_SECRET)
        }
        catch (error) {
            console.log(AppString.invalidAccessToken)
            res.status(401)
            return res.json(baseRespond(false, AppString.invalidAccessToken))
        }
        req.headers['userInfor'] = payload;
        // req.body.email = payload.email
        // req.body.id = payload.id
        // req.body.loginType = payload.loginType
        // req.body.role = payload.role
        next()
    }
    checkPermission(req, res, next) {
       if (req.headers['userInfor'].role == 'Operator')  {
        next()
       } else {
        res.status(400)
       next(AppString.noPermission)
       }
    }
}

module.exports = new AuthMiddleware()
