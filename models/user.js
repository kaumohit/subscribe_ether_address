let mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    address: {
        type: String,
        index: {
            unique: true,
            dropDups: true
        }

    }
});

mongoose.connect('mongodb://localhost:27017/emailService');
module.exports = mongoose.model('user', userSchema)