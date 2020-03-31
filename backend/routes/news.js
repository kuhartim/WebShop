const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const News = require('../src/models/news.model');
const auth = require('../src/middleware/auth');

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

		const { email } = req.body;

		const news = new News({ email });

		const savedNews = await news.save();

		return res.send(savedNews);

	}

	catch(err){
		debug(err);
		if(err.message.includes("E11000"))
			res.status(400).send({ message: "Email already exists!" });
		res.status(500).send('Internal error');
	}
});

//read all
router.get('/', auth(true), async (req, res) => {

	try{

		const news = await News.find();

		res.send(news);

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

		await News.deleteOne({_id: id});

		res.send("Deleted");

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}

});


module.exports = router;