const mongoose = require('mongoose');
const mongooseHidenn = require('mongoose-hidden')({ defaultHidden: { __v: true} });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Order = new Schema({
	user: {
		type: ObjectId,
		required: true
	},

	products: {
		type: Array,
		required: true
	},

	firstName: {
		type: String,
		required: true
	},

	lastName: {
		type: String,
		required: true
	},

	adress: {
		type: String,
		required: true
	},

	postalCode: {
		type: Number,
		required: true
	},

	city: {
		type: String,
		required: true
	},

	phone: {
		type: String,
	},

	paymentMethod: {
		type: String,
		enum: ["stripe", "upn", "pickup"]
	},

	status: {
		type: String,
		enum: ["created", "waitingForPayment", "processing", "shipped", "delivered"],
		default: "created" 
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

Order.plugin(mongooseHidenn);
module.exports = mongoose.model('orders', Order);