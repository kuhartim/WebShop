const express = require('express');
const fs = require('fs');
const router = express.Router();
const Joi = require('@hapi/joi');
const sizeOf = require('image-size');
const _ = require('lodash');
const path = require('path');
const sharp = require('sharp');
const auth = require('../src/middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const config = require('../config');

const Product = require('../src/models/products.model');

const debug = require('debug')('backend:product-router');

const schemaCreate = Joi.object({

	name: Joi.string()
				.min(3)
				.max(255)
				.required(),

	description: Joi.string()
						.min(10)
						.max(500)
						.required(),

	price: Joi.number()
				.required(),

});

const schemaUpdate = Joi.object({
	name: Joi.string()
				.min(3)
				.max(255)
				.required(),

	description: Joi.string()
						.min(10)
						.max(500)
						.required(),

	price: Joi.number()
				.required()
});

const schemaImage = Joi.object({
	mimetype: Joi.valid('image/gif', 'image/png', 'image/jpeg', 'image/jpg')
					.required(),

	size: Joi.number()
				.max(1000000) // 1 MB
				.required()
}).options({ stripUnknown: true });

//create
router.post('/', auth(true), upload.single('image'), async (req, res) => {

	try{

		const { error } = schemaCreate.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { error: errorImage } = schemaImage.validate(req.file);

		if(errorImage) return res.status(400).send({ errorImage, message: "Validation error"});

		const dimensions = sizeOf(path.join(__dirname, `../uploads/${ req.file.filename }`));

		if(dimensions.width < 500 || dimensions.height < 500) return res.status(400).send({message: "Validation error"});

		if(dimensions.width/dimensions.height !== 1) return res.status(400).send({message: "Validation error"});

		const resize = size => new Promise((resolve, reject) =>{
			sharp(path.join(__dirname, `../uploads/${ req.file.filename }`))
				.resize(size, size)
				.toFile(path.join(__dirname, `../uploads/${ req.file.filename }_${size}`), err => err? reject(err):resolve());
		});


		try{
			await Promise.all([
				resize(500),
				resize(300),
				resize(200),
				resize(150)
			]);
		}
		catch(err){

			const unlink = path => new Promise((resolve, reject) =>{
				fs.unlink(path, err => err? reject(err):resolve());
			});

			await unlink(path.join(__dirname, `../uploads/${ req.file.filename }_500`));
			await unlink(path.join(__dirname, `../uploads/${ req.file.filename }_300`));
			await unlink(path.join(__dirname, `../uploads/${ req.file.filename }_200`));
			await unlink(path.join(__dirname, `../uploads/${ req.file.filename }_150`));
		}
			

		const { name, description, price } = req.body;

		const product = new Product({
			author: req.user.id,
			image: req.file.filename,
			imageMimeType: req.file.mimetype,
			name, description, price
		});

		const savedProduct = await product.save();

		res.send(savedProduct);

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}

});

//update
router.post('/:id', auth(true), upload.single('image'), async (req, res) => {

	try{

		const { error } = schemaUpdate.validate(req.body);

		if(error) return res.status(400).send({ error, message: "Validation error"});

		const { id } = req.params;

		const product = await Product.findById(id);

		if(!product) return res.status(404).send({ message: "Not found"});

		if(req.user.id !== product.author) return res.status(403).send({ message: "Unauthorized"});

		const { error: errorImage } = schemaImage.validate(req.file);	

		_.assign(product, _.pick(req.body, ['name', 'description', 'price']), { 
			image: !errorImage ? req.file.filename : product.image,
			update: Date.now()
		});

		const savedProduct = await product.save();

		res.send(savedProduct);


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

		const product = await Product.findById(id);

		if(req.user.id !== product.author) return res.status(403).send({ message: "Unauthorized"});

		await Product.deleteOne({ _id: id });

		res.send(product);

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}
});

//read image
router.get('/image/:id', async (req, res) => {

	try{

		const { id } = req.params;

		const [image, size] = id.split('_');

		const product = await Product.findOne({ image });

		if(!product) return res.status(404).send("Not found");

		const { imageMimeType } = product;

		res.setHeader('content-type', imageMimeType);
		res.sendFile(path.join(__dirname, `../uploads/${ id }`));
		

	}
	catch(err){
		debug(err);
		if(!res.finished) res.status(500).send('Internal error');
	}

});

//read
router.get('/:id', async (req, res) => {

	try{
	
		const { id } = req.params;

		const product = await Product.findById(id);

		if(!product) return res.status(404).send('Not found');

		res.send(product);

	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}

});

//read all
router.get('/', async (req, res) => {

	try{
	
		const { docs, page, totalPages } = await Product.paginate({}, {
			sort: "-create",
			page: req.query.page || 1,
			limit: req.query.perPage || 20
		})

		const mappedDocs = docs.map((doc) => ({
			title: doc.name,
			description: doc.description,
			price: doc.price,
			image: `http://${ config.host }/api/v1/product/image/${doc.image}`
		}));

		res.send({ docs: mappedDocs, page, totalPages });


	}
	catch(err){
		debug(err);
		res.status(500).send('Internal error');
	}



});

module.exports = router;