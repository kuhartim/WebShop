const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const debug = require('debug')('backend:user-router');

const Token = require('../src/models/token.model');
const User = require('../src/models/users.model');
const { tokenSecret, tokenExpiry } = require('../config');
const auth = require('../src/middleware/auth');

const schemaRegistration = Joi.object({

	email: Joi.string()
				.email({ minDomainSegments: 2 })
				.required(),

	password: Joi.string()
				.min(8)
				.max(255)
				.required(),

	password_confirm: Joi.ref('password')

});

const schemaLogin = Joi.object({

	email: Joi.string()
				.email({ minDomainSegments: 2 })
				.required(),

	password: Joi.string()
				.min(8)
				.max(255)
				.required(),
});

//registration

router.post('/', async (req, res) => {

	try{
		const { error } = schemaRegistration.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { email, password } = req.body;

		const count = await User.countDocuments({ email });

		if(count > 0) return res.status(400).send({ message: "User with this email already exists" });

		let type = "CUSTOMER";

		if(await User.countDocuments() === 0) type = "ADMIN";

		const user = new User({ email, password, type });

		const savedUser = await user.save()
			
		res.send(savedUser);
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}

	

});

//Login
router.post('/token', async (req, res) => {

	try{
		const { error } = schemaLogin.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if(!user) return res.status(403).send({ message: "Unauthorized"});

		if(!await bcrypt.compare(password, user.password)) return res.status(403).send({ message: "Unauthorized"});

		const token = new Token({
			userId: user.id,
			token: jwt.sign({
				id: user.id
			}, tokenSecret, { expiresIn: tokenExpiry })
		});

		const savedToken = await token.save();

		res.send(savedToken);
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}


});

//Logout
router.delete('/token', auth(), async (req, res) => {

	try{

		await Token.deleteOne({ token: req.token });
		
		res.send('Logout');
		
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}


});

module.exports = router;