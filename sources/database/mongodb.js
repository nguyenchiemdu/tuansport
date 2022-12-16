const mongoose = require('mongoose');
const Category = require('../models/mongo/mongo.category')
let {importCategories,importAttributes} = require('../common/sync_data');
const mongoProduct = require('../models/mongo/mongo.product');
async function connect() {

    try {        
        await mongoose.connect('mongodb+srv://tuansport:KqrXhiILksIdAxL0@cluster0.tnljsnn.mongodb.net/tuansportdb?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        // importAttributes();
        console.log('Connect to Mongo DB successfully!');
        // importCategories(793639)
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
