const mongoose = require('mongoose');
const User = require('../models/mongo/mongo.user')
async function connect() {

    try {        
        await mongoose.connect('mongodb+srv://tuansport:KqrXhiILksIdAxL0@cluster0.tnljsnn.mongodb.net/tuansportdb?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        console.log('Connect to Mongo DB successfully!');
    } catch (error) {
        console.log('Connect Mongo DB failure!');
        console.log('Error: ',error)
    }

}

module.exports = { connect };
