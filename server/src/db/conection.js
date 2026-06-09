const mongoose = require('mongoose');
const { DB_NAME } = require('../constant')

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.info(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`MONGODB connection FAILED ${error}`);
        process.exit(1);
    }
}

mongoose.connection.on("connected", () => {
    console.info(`\n Database is connected sucessfuly!! DB HOST:${mongoose.connection.host}`);
});

mongoose.connection.on("error", () => {
     console.error('Databse connection error : \n', err);
});

mongoose.connection.on("disconnected", () => {
    console.info('Database is disconnected!');
});

module.exports = { connectDB };