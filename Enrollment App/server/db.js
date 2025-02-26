const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL).then(() => {
            console.log('Database Connected Successfully');
        })
    } catch (error) {
        console.log('Error while connecting to the database', error.message);
    }
}

module.exports = connection;