const mongoose = require('mongoose');

const slapModel = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    usersSlapped: { type: Array, default: []},
    slappedBy: { type: Array, default: []}
})

const model = mongoose.model('slapModel', slapModel);

module.exports = model;