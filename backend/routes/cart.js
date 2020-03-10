const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const auth = require('../src/middleware/auth');
const path = require('path');

const Cart = require('../src/models/cart.model');
const Product = require('../src/models/products.model');

const debug = require('debug')('backend:cartrouter');

const schemaAdd = Joi.object({

	product: Joi.string()
				.length(24)
				.required(),

	number: Joi.number()
				.required()

});

const schemaUpdate = Joi.object({

	number: Joi.number()
				.required()

});

//read all
router.get('/', auth(), async (req, res) => {

	try{

		const cart = await Cart.find({ user: req.user.id});

		if(!cart) return res.status(404).send('Not found');

		const cartPromises = cart.map(async product=> {
			const productObject = product.toObject();
			try{
				const result = await Product.findById(product.product);
				productObject.product = result.toObject();
			}
			catch(err){
				productObject.product = {};
			}
			return productObject;
		});

		const cartEntries = await Promise.all(cartPromises);

		return res.send(cartEntries);

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
})

//add
router.post('/', auth(), async (req, res) => {

	try{

		const { error } = schemaAdd.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const cart = new Cart({
			user: req.user.id,
			product: req.body.product,
			number: req.body.number
		})

		const savedCart = await cart.save();

		return res.send(savedCart);

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
})

//update
router.post('/:id', auth(), async (req, res) =>{

	try{

		const { error } = schemaUpdate.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { id } = req.params;

		const cart = await Cart.findById(id);

		cart.number = req.body.number;

		const savedCart = await cart.save();

		return res.send(savedCart);

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});

//delete
router.delete('/:id', auth(), async (req, res) =>{

	try{

		const { id } = req.params;

		const cart = await Cart.findById(id);

		await cart.delete();

		return res.send(cart);

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});

//delete all
router.delete('/', auth(), async (req, res) =>{

	try{

		await Cart.delete({user: req.user.id});

		return res.send("OK");

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});

module.exports = router;