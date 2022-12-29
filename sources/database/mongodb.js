const mongoose = require('mongoose');
const Category = require('../models/mongo/mongo.category')
let {importCategories,importAttributes,importProduct,backupSyncedProduct} = require('../common/sync_data');
const mongoProduct = require('../models/mongo/mongo.product');
const webhookController = require('../controllers/webhook_controller');
async function connect() {

    try {        
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        // importCategories();
        // importAttributes();
        // importProduct();
        // backupSyncedProduct()
        if ((process.env.WEBHOOK ?? 'false') == 'true') webhookController.reRegistWebhook()
        console.log('Connect to Mongo DB successfully!');
        // Category.create({
        //     _id: 7,
        //     categoryName: 'Dụng cụ TDTT',
        // })

        // let count = await mongoProduct.countDocuments({})
        // let docs = []
        // await mongoProduct.find({})
        //     .then(products => products.forEach(product => docs.push(product)))
        // for (let i = 0; i < count; i++) {
        //     mongoProduct.updateMany({_id: docs[i]._id}, {
        //         tag: ''
        //     }).then(res => console.log(res))
        // }
    }
        catch (error) {
        console.log('Connect Mongo DB failure!');
        console.log('Error: ',error)
    }

}

module.exports = { connect };
