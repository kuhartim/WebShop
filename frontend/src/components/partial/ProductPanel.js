import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import "./scss/ProductPanel.scss";

function ProductPanel({ title, description, price, image }) {

	return (

		<div className="product-panel">
			<picture>
				<source srcSet={ `${image}_500` } media="(min-width: 2500px)"/>
				<source srcSet={ `${image}_300` } media="(min-width: 1650px)"/>
				<source srcSet={ `${image}_200` } media="(min-width: 1250px)"/>
				<img src={ `${image}_150` } alt="" className="product-panel__image" />
			</picture>
			<h2 className="product-panel__title">{ title }</h2>
			<p className="product-panel__description">{ description }</p>
			<span className="product-panel__price">{ price }</span>
			<div className="product-panel__overlay">
				<a href="#" className="product-panel__button product-panel__button--cart" title="Add to Cart">Add to Cart</a>
				<Link to="/products" className="product-panel__button product-panel__button--view" title="View Product">View Product</Link>
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