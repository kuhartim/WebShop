const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseHidenn = require('mongoose-hidden')({ defaultHidden: { __v: true } });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Product = new Schema({
	author: ObjectId,
	image: String,
	name: String,
	description: String,
	price: Number,
	imageMimeType: String, 
	create: {
		type: Date,
		default: Date.now
	},
	update: {
		type: Date,
		default: Date.now
	}
});

Product.plugin(mongoosePaginate);
Product.plugin(mongooseHidenn);
module.exports = mongoose.model('products', Product);