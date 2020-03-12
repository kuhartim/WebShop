const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const News = require('../src/models/news.model');

const debug = require('debug')('backend:newsrouter');

const schemaAdd = Joi.object({

	email: Joi.string()
				.email({ minDomainSegments: 2 })
				.required()

});

//create
router.post('/', async (req, res) => {

	try{

		const { error } = schemaAdd.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const news = new News({
			email: req.body.email
		});

		const savedNews = await news.save();

		return res.send(savedNews);

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
})

//if mail already exist
router.post('/check', async (req, res) => {

	try{

		const { error } = schemaAdd.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { email } = req.body;

		const checkNews = await News.findOne({ email });

		if(!!checkNews) return res.status(400).send({ error, message: "User already exist!"});

		res.send("OK");

	}
	catch(err){
		debug(err);
		res.status(500).send("Internal error");
	}

});

module.exports = router;