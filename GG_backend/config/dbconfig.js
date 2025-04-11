const mongoose = require('mongoose');

const dbConnect = async() => {
    try{
        await mongoose.connect('mongodb+srv://thamizhselvik30:Thamizh29@cluster0.pj5np.mongodb.net/greengrocery?retryWrites=true&w=majority&appName=Cluster0');
        console.log("DB connection established");    }
    catch(err)
    {
        console.log("Error while connecting "+ err);
    }
}

module.exports = dbConnect;