const mongoose = require('mongoose');
const mongooseHidenn = require('mongoose-hidden')({ defaultHidden: { __v: true} });
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
	email: {
		type: String, 
		unique: true, 
		required: true
	},
	password: { 
		type: String, 
		hide: true,
		set: value => bcrypt.hashSync(value, 10),
		required: true
	},
	type: {
		type: String,
		enum: ['ADMIN', 'CUSTOMER'],
		default: 'CUSTOMER'
	},
	create: {
		type: Date,
		default: Date.now
	},
	update: {
		type: Date,
		default: Date.now
	}
});

User.plugin(mongooseHidenn);
module.exports = mongoose.model('users', User);