const mongoose = require('mongoose');

const slapModel = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    usersSlapped: { type: Array, default: []},
    slappedBy: { type: Array, default: []},
    slapCount: { type: Number, default: 0},
    alBlueSlaps: { type: Number, default: 0},
    slapCD: { type: Number}
})

const model = mongoose.model('slapModel', slapModel);

module.exports = model;