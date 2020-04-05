const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const News = require('../src/models/news.model');
const auth = require('../src/middleware/auth');

const debug = require('debug')('backend:newsrouter');

const schemaAdd = Joi.object({

	email: Joi.string()
				.email({ minDomainSegments: 2 })
				.max(256)
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

		const page = Number(req.query.page) || 1;
		const perPage = Number(req.query.perPage) || 10;

		debug(req.query.page);
		debug(req.query.perPage);

		const numberAll = await News.countDocuments();

		if(Math.ceil(numberAll / perPage) < page || page < 1 || numberAll == 0) res.status(404).send({ message: "Not found" });

		const news = await News.find().sort("-create").skip((page-1) * perPage).limit(perPage);

		debug(news);

		res.send({news, page, numberAll: Math.ceil(numberAll / perPage)});

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

//delete all
router.delete('/', auth(true), async (req, res) => {

	try{

		await News.deleteMany({});

		res.send("Deleted");

	}

	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}

});


module.exports = router;