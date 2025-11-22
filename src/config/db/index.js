const mongoose = require('mongoose');
require('dotenv').config();

async function connect(){
    try{
        const db_uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/baokim_dev'
        console.log('Connecting to MongoDB at', db_uri);
        await mongoose.connect(db_uri);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Failed to connect to the database');
    }
}

module.exports = {connect}