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

const schemaUpdateStatus = Joi.object({

	status: Joi.valid("created", "waitingForPayment", "processing", "shipped", "delivered")
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

		let currentOrder = await Order.findOne({user: req.user.id, status: "created"});

		let savedOrder;

		if(currentOrder){
				currentOrder.firstName = req.body.firstName;
				currentOrder.lastName = req.body.lastName;
				currentOrder.adress = req.body.adress;
				currentOrder.postalCode = req.body.postalCode;
				currentOrder.city = req.body.city;
				currentOrder.phone = req.body.phone;
				currentOrder.products = products;
			

			savedOrder = await currentOrder.save();

		}
		else{
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

			savedOrder = await order.save();
		}

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
		if(req.body.paymentMethod != "stripe")
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

//update status
router.post('/status/:id', auth(true), async(req, res) => {

	try{

		const { error } = schemaUpdateStatus.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { id } = req.params;

		const order = await Order.findById(id);

		if(!order) return res.status(404).send('Not found');

		order.status = req.body.status;

		const savedOrder = await order.save();

		res.send(savedOrder);

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
})

//read id
router.get('/order/:id', auth(), async (req, res) => {

	try{

		const { id } = req.params;

		const order = await Order.findById(id);

		if(!order) return res.status(404).send('Not found');

		res.send(order);

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});


//read
router.get('/', auth(), async (req, res) => {

	try{

		const status = req.query.status;

		const order = await Order.findOne({user: req.user.id, status});

		res.send({order});

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});

//read all
router.get('/all', auth(true), async(req, res) => {

	try{

		const orders = await Order.find();

		res.send(orders);

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});

//delete
router.delete('/:id', auth(true), async (req, res) => {

	try{

		const { id } = req.params;

		const order = await Order.findById(id);

		if(!order) return res.status(404).send('Not found');

		await Order.deleteOne({_id: id});

		res.send("Deleted");

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}

})



module.exports = router;