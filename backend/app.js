var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const newsRouter = require('./routes/news');
const orderRouter = require('./routes/order');
const paymentRouter = require('./routes/payment');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use('/api/v1/payment', paymentRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/order', orderRouter);

module.exports = app;
