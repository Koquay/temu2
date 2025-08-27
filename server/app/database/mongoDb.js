const mongoose = require('mongoose');

module.exports = async () => {
    const DB = process.env.DB || 'mongodb://localhost:27017/temu2';

    try {
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(DB)

        console.log('*** CONNECTED TO MONGODB ***')
    } catch(error) {
        console.log('*** CONNECTION TO MONGODB FAILED ***')
        console.log('error', error)
        throw error;
    }
}