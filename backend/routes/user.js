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

	password_confirm: Joi.ref('password'),

	question: Joi.string()
				 .min(3)
				 .max(255)
				 .allow('')
				 .optional(),

	answer: Joi.string()
				.min(3)
				.max(255)
				.allow('')
				.optional()

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

		const { email, password, question, answer } = req.body;

		const count = await User.countDocuments({ email });

		if(count > 0) return res.status(400).send({ message: "User with this email already exists" });

		let type = "CUSTOMER";

		if(await User.countDocuments() === 0) type = "ADMIN";

		const user = new User({ email, password, type, question, answer });

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

//Admin check
router.post('/admin', auth(), async (req, res) => {

	try{

		const user = req.user;
		if(!user || user.type != "ADMIN") return res.status(403).send({ message: "Unauthorized"});
		
		res.send('Admin');
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}
});

//Get user
router.post('/user', auth(), async (req, res) =>{

	try{

		const user = req.user;
		if(!user) return res.status(403).send({ message: "Unauthorized"});

		res.send(user);
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}
});

//Get all users
router.get('/', auth(true), async (req, res) => {

	try{

		const page = Number(req.query.page) || 1;
		const perPage = Number(req.query.perPage) || 10;

		const numberAll = await User.countDocuments();

		console.log(numberAll);

		if(Math.ceil(numberAll / perPage) < page || page < 1 || numberAll == 0) res.status(404).send({ message: "Not found" });

		const users = await User.find().sort({ type: 1,create : -1}).skip((page-1) * perPage).limit(perPage);

		res.send({users, page, numberAll: Math.ceil(numberAll / perPage)});

	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}

});

//check if user exist by mail
router.post('/exist', async (req, res) =>{

	try{

		const email = req.body.email;

		const user = await User.findOne({email});

		if(!user) return res.status(404).send("Not found");

		res.send(user.question);
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}
});

//check if user answer is correct
router.post('/question', async (req, res) =>{

	try{

		const email = req.body.email;
		const answer = req.body.answer;

		const user = await User.findOne({email});

		if(!user) return res.status(404).send("Not found");

		if(user.answer != answer) return res.status(403).send({ message: "Unauthorized"});

		res.send("ok");
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}
});

//change password
router.post('/changePassword', async (req, res) => {

	try{

		const {email, answer, password} = req.body;

		console.log(req.body);

		const user = await User.findOne({email});

		if(!user) return res.status(404).send("Not found");

		if(user.answer != answer) return res.status(403).send({ message: "Unauthorized"});

		user.password = password;

		user.save();

		res.send("Changed");


	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}
});

//delete user
router.delete('/:id', auth(true), async (req, res) => {

	try{

		const { id } = req.params;

		const user = await User.findById(id);

		if(!user) return res.status(404).send({ message: "Not found"});

		if(user.type == "ADMIN") return res.status(403).send({ message: "Unauthorized"});

		await User.deleteOne({_id: id});

		res.send("Deleted");
		
	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}
})

module.exports = router;