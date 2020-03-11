import React, { useState, useEffect, useCallback } from "react";
import {NotificationManager} from 'react-notifications';

import { findProduct } from "../services/shop.api";
import {addToCart} from "../services/shop.api";


import "./scss/Product.scss";

function Product({ match: { params: { product: id } } }){

	const [productObject, setProduct] = useState({});

	useEffect(() => {

		(async () => {
			try{
				const result = await findProduct(id);
				setProduct(result.data);
			}

			catch(err){
				console.error(err);
				NotificationManager.error("Product couldn't load!", "Error");
			}
		})();

	}, [setProduct, id]);

	const addCart = useCallback(() => {
		addToCart(id, 5)
		.then(() => {
			NotificationManager.success("Successfully added!", "Success");
		})
		.catch(() => {
			console.log(id)
			NotificationManager.error("Couldn't add product to cart!", "Error");
		})
	}, [id]);


	return(

		<div className="product">
			<h1>
			{
				productObject.name
			}
			</h1>
			<button onClick={addCart}>Add to cart</button>
		</div>

	);
}

export default Product;