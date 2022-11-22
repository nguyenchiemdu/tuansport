const { json } = require("express");

class LoginController {
    // GET 
    async login (req,res) {
        res.render("login/login")
    }
}

module.exports = new LoginController();