import React from "react";
import {Link} from "react-router-dom";
import {NotificationManager} from 'react-notifications';
import PropTypes from "prop-types";

import {addToCart} from "../../services/shop.api";

import "./scss/ProductPanel.scss";

function ProductPanel({ id, title, description, price, image }) {

	const addCart = () => {
		addToCart(id, 1)
		.then(() => {
			NotificationManager.success("Successfully added!", "Success");
		})
		.catch(() => {
			console.log(id)
			NotificationManager.error("Couldn't add product to cart!", "Error");
		})
	};

	return (

		<div className="product-panel">
			<picture>
				<source srcSet={ `${image}_500` } media="(min-width: 2500px)"/>
				<source srcSet={ `${image}_300` } media="(min-width: 1650px)"/>
				<source srcSet={ `${image}_200` } media="(min-width: 1250px)"/>
				<img src={ `${image}_150` } alt="" className="product-panel__image" />
			</picture>
			<h2 className="product-panel__title">{ title }</h2>
			<p className="product-panel__description">{ description.length > 16 ? description.substring(0, 16) + "..." : description }</p>
			<span className="product-panel__price">{ price } €</span>
			<div className="product-panel__overlay">
				<a href="#" className="product-panel__button product-panel__button--cart" title="Add to Cart" onClick={addCart}>Add to Cart</a>
				<Link to={`/products/${id}`} className="product-panel__button product-panel__button--view" title="View Product">View Product</Link>
			</div>
		</div>

	);
}

ProductPanel.propTypes = {

	title: PropTypes.string,
	description: PropTypes.string,
	price: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	image: PropTypes.string
}

export default ProductPanel;