const jwt = require("jsonwebtoken");

const debug = require('debug')('backend:auth');

const { tokenSecret} = require('../../config');
const Token = require('../models/token.model');
const User = require('../models/users.model');

module.exports = admin => async (req, res, next) => {

	try{

		if(!req.headers.hasOwnProperty('authorization')) 
			return res.status(403).send({ message: "Unauthorized"});

		const authorization = req.headers['authorization'];

		const [ , token ] = authorization.split(' ');

		let decodedToken;

		try{

			decodedToken = jwt.verify(token, tokenSecret);

		}
		catch(err){
			debug(err);
			res.status(403).send({ message: "Unauthorized"});
			return;
		}

		const count = await Token.countDocuments({ token });

		if(count < 1) return res.status(403).send({ message: "Unauthorized"});

		req.user = await User.findById(decodedToken.id);

		if(!req.user) return res.status(403).send({ message: "Unauthorized"});

		if(admin && req.user.type !== "ADMIN") return res.status(403).send({ message: "Unauthorized"});

		req.token = token;
		next();

	}
	catch(err){
		debug(err);
		res.status(500).end('Internal error');
	}

}
