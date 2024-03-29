const mongoose = require('mongoose');
const mongooseHidenn = require('mongoose-hidden')({ defaultHidden: { __v: true} });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Cart = new Schema({
	user: {
		type: ObjectId,
		required: true
	},

	product: {
		type: ObjectId,
		required: true
	},

	number: {
		type: Number,
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

Cart.plugin(mongooseHidenn);
module.exports = mongoose.model('carts', Cart);