const mongoose = require('mongoose');
const mongooseHidenn = require('mongoose-hidden')({ defaultHidden: { __v: true} });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const News = new Schema({
	email: {
		type: String, 
		unique: true, 
		required: true
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

News.plugin(mongooseHidenn);
module.exports = mongoose.model('news', News);