const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    email: String,
    password: String,
    // otros campos que necesites
});

module.exports = mongoose.model('User', userSchema);
