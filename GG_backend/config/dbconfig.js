const mongoose = require('mongoose');

const dbConnect = async() => {
    try{
        await mongoose.connect('replace with with your Mongo DB connection link');
        console.log("DB connection established");    }
    catch(err)
    {
        console.log("Error while connecting "+ err);
    }
}

module.exports = dbConnect;
