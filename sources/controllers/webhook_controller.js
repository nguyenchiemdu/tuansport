const AppString = require("../common/app_string");
const { writeFile,baseRespond } = require("../common/functions");

class WebhookController {
    async updateProduct(req,res,next){
        let body = req.body;
        await writeFile('./sources/public/update-product.json',JSON.stringify(body))
        res.json(baseRespond(true,AppString.ok))
    }
    async deleteProduct(req,res,next){
        let body = req.body;
        await writeFile('./sources/public/delete-product.json',JSON.stringify(body))
        res.json(baseRespond(true,AppString.ok))
    }
}

module.exports = new WebhookController();