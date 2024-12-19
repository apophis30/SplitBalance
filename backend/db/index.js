const { type } = require("express/lib/response");
const mongoose = require("mongoose");

mongoose.connect('YOUR_MONGO_DB_INSTANCE')
.then(() => console.log('Connected !'));

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// Accounts Schema
const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {
    User,
    Account
}
