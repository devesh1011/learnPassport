const mongoose = require("mongoose");

const DB_URI = 'mongodb://localhost:27017/tempDB';

const connectDB = async () => {
    mongoose.connect(DB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(error => {
            console.error('Error connecting to MongoDB:', error);
        });
}

module.exports = connectDB;