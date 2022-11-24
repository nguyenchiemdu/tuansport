const { json } = require("express");
const mongoUser = require("../models/mongo/mongo.user")

class LoginController {
    // GET 
    async login (req,res) {
        res.render("login/login")
    }
    // POST
    async authentication(req,res,next) {
        try {
            // Authentication 
            const isEmail = isValidateEmail(req.body.email)
            let user
            if (isEmail) {
                user = await mongoUser.findOne({ email: req.body.email })
            } else {
                user = await mongoUser.findOne({ userName: req.body.email })
            }
            if (!user) return res.json(baseRespond(false, AppString.invalidEmailPass))
            let isRightPassword = await bcrypt.compare(req.body.password, user.password)
            if (!isRightPassword) {
                return res.json(baseRespond(false, AppString.invalidEmailPass))
            }

            if (user.isActive != true) {
                return res.json(baseRespond(false,))
            }

            res.status(200)
            //Create JWT
            const accessToken = generateJWT(user, LoginType.normal)
            let response = baseRespond(true, AppString.ok, {
                // ...userInfor(user._doc),
                'token': accessToken
            })
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new LoginController();