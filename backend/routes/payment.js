const express = require('express');
const router = express.Router();
const config = require("../config");
const bodyParser = require('body-parser');

const stripe = require('stripe')(config.stripeSecret);

const Order = require('../src/models/orders.model');

const debug = require('debug')('backend:paymentrouter');

router.post('/webhook', bodyParser.raw({type: 'application/json'}),async (req, res) => {

	const sig = req.headers['stripe-signature'];

	let event;

	debug(event);
	debug(sig);
	debug(config.stripeWebHookSecret);

	try {
    	event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebHookSecret);
  	}
  	catch (err) {
    	res.status(400).send(`Webhook Error: ${err.message}`);
    	debug(err);
    	return;
  	}

	console.log(req.body);

	switch (event.type) {
	    case 'payment_intent.succeeded':
		      const paymentIntent = event.data.object.id;

		      console.log('PaymentIntent was successful!')

		      const order = await Order.findOne({paymentIntent});

		      order.status = "processing";

		      await order.save();

		      res.send("OK");

		      break;

	    // ... handle other event types
	    default:
	      // Unexpected event type
	      	return res.status(400).end();
  	}

});


module.exports = router;