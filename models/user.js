var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userid: String,
    password: String,
	name: String
});

module.exports = mongoose.model('user', userSchema);