const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const auth = require('../src/middleware/auth');

const stripe = require('stripe')('sk_test_ekE5p62AZ2REGKdbi3FxOoPr00gBXHkB2y');

const Order = require('../src/models/orders.model');
const Cart = require('../src/models/cart.model');
const Product = require('../src/models/products.model');

const debug = require('debug')('backend:orderrouter');

const schemaAdd = Joi.object({

	firstName: Joi.string()
				  .min(3)
				  .required(),

	lastName: Joi.string()
				 .min(3)
				 .required(),

	adress: Joi.string()
			   .min(5)
			   .required(),

	postalCode: Joi.number()
				   .required(),

	city: Joi.string()
			 .min(3)
			 .required(),

	phone: Joi.string()
			  .min(9)
			  .allow('')
			  .optional()
});

const schemaUpdate = Joi.object({

	paymentMethod: Joi.valid("upn", "pickup", "stripe")
					  .required()
});

//add
router.post('/', auth(), async (req, res) => {

	try{

		const { error } = schemaAdd.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const cart = await Cart.find({user: req.user.id});

		if(cart.length < 1) return res.status(404).send('Not found');

		const products = await Promise.all(cart.map(async (cart) => {

			const product = await Product.findById(cart.product);

			return {
				product: product.toObject(),
				number: cart.number
			};
		}));


		const order = new Order({
			user: req.user.id,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			adress: req.body.adress,
			postalCode: req.body.postalCode,
			city: req.body.city,
			phone: req.body.phone,
			products
		});

		const savedOrder = await order.save();

		return res.send(savedOrder);

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
})

//update
router.post('/:id', auth(), async (req, res) => {

	try{

		const { error } = schemaUpdate.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { id } = req.params;

		const order = await Order.findById(id);

		if(!order) return res.status(404).send('Not found');

		order.paymentMethod = req.body.paymentMethod;
		order.status = "waitingForPayment";

		let stripeSecret = null;

		if(req.body.paymentMethod == "stripe"){

			const paymentIntent = await stripe.paymentIntents.create({
  				amount: order.products.reduce((sum, product) => sum + product.number * product.product.price, 0)*100,
  				currency: 'eur',
  				// Verify your integration in this guide by including this parameter
  				metadata: {integration_check: 'accept_a_payment'},
			});

			stripeSecret = paymentIntent.client_secret;

		}

		const savedOrder = await order.save();

		return res.send({savedOrder, stripeSecret});

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
})

//read
router.get('/', auth(), async (req, res) => {

	try{

		const order = await Order.findOne({user: req.user.id, status: "created"});

		res.send({ order });

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});



module.exports = router;