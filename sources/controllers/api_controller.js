const { json } = require("express");

class ApiController {
    tryApi(_, res) {
        let response = {"success": true,"message": "OK","data": ""};
        res.json(response);
        console.log(response)
    }
}

module.exports = new ApiController();