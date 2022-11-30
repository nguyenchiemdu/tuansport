const mongoose = require('mongoose');
const Category = require('../models/mongo/mongo.category')
let {importCategories,importAttributes} = require('../common/sync_data')
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
    } catch (error) {
        console.log('Connect Mongo DB failure!');
        console.log('Error: ',error)
    }

}

module.exports = { connect };
