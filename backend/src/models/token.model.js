const mongoose = require('mongoose');
const mongooseHidenn = require('mongoose-hidden')({ defaultHidden: { __v: true} });
const bcrypt = require("bcrypt");

const { tokenExpiry } = require("../../config");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Token = new Schema({

	userId: {
		type: ObjectId,
		required: true,
		hide: true
	},
	
	create: {
		type: Date,
		default: Date.now
	},

	token: {
		type: String,
		required: true
	},

	expiresAt: {
		type: Date,
		default: () => Date.now() + tokenExpiry*1000
	}

});

Token.plugin(mongooseHidenn);
module.exports = mongoose.model('tokens', Token);