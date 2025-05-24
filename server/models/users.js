const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    first_name: String,
    second_name: String,
    email: String,
    accessLevel: Number,
    password: String,
    profile_picture: String,
    house_address: String,
    telephone_no: String
},
{
    collection: 'users'
})

module.exports = mongoose.model('users', usersSchema)