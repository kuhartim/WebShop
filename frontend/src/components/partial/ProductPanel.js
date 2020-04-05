import React, {useState, useCallback} from "react";
import {Link} from "react-router-dom";
import {NotificationManager} from 'react-notifications';
import PropTypes from "prop-types";

import {addToCart} from "../../services/shop.api";

import "./scss/ProductPanel.scss";

function ProductPanel({ id, title, description, price, image }) {

	const [turn, setTurn] = useState(false);
	const [unturn, setUnturn] = useState(false);

	const addCart = useCallback(() => {
		addToCart(id, 1)
		.then(() => {
			NotificationManager.success("Successfully added!", "Success");
		})
		.catch(() => {
			console.log(id)
			NotificationManager.error("Couldn't add product to cart!", "Error");
		})
	}, [id]);

	const activateTurn = useCallback(() => setTurn(true), [setTurn]);
	const deactivateTurn = useCallback(() => {

		setUnturn(true);

		setTimeout(() => {
  			setTurn(false);
  			setUnturn(false);
		}, 600);

	}, [setTurn]);

	return (

		<div className="product-panel">
			<div className={`product-panel__front ${turn ? "product-panel__front--turn" : ""} ${unturn ? "product-panel__front--unturn" : ""}`} onClick={activateTurn}>
				<picture>
					<source srcSet={ `${image}_500` } media="(min-width: 2500px)"/>
					<source srcSet={ `${image}_300` } media="(min-width: 1650px)"/>
					<source srcSet={ `${image}_200` } media="(min-width: 1250px)"/>
					<img src={ `${image}_150` } alt="" className="product-panel__image" />
				</picture>
				<h2 className="product-panel__title">{ description.length > 10 ? description.substring(0, 10) + "..." : description }</h2>
				<p className="product-panel__description">{ description.length > 16 ? description.substring(0, 16) + "..." : description }</p>
				<span className="product-panel__price">{ price } €</span>
			</div>
			<div className={`product-panel__overlay ${turn ? "product-panel__overlay--turn" : ""} ${unturn ? "product-panel__overlay--unturn" : ""}`}>
				<a href="#" className="product-panel__button product-panel__button--cart" title="Add to Cart" onClick={addCart}>Add to Cart</a>
				<Link to={`/products/${id}`} className="product-panel__button product-panel__button--view" title="View Product">View Product</Link>
				<button className="product-panel__button product-panel__button--turn" hidden={!turn} onClick={deactivateTurn}>Turn</button>
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