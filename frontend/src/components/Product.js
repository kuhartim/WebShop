import React, { useState, useEffect, useCallback } from "react";
import {NotificationManager} from 'react-notifications';

import * as Vibrant from 'node-vibrant';

import { findProduct } from "../services/shop.api";
import {addToCart} from "../services/shop.api";



import "./scss/Product.scss";

function Product({ match: { params: { product: id } } }){

	const [productObject, setProduct] = useState({});
	const [quantity, setQuantity] = useState("");
	const [rgb, setRgb] = useState({});

	const onQuantityChange = useCallback(({target: {value}}) => setQuantity(value), [setQuantity]);

	useEffect(() => {

		(async () => {
			try{
				const result = await findProduct(id);
				Vibrant.from(result.data.image).getPalette((err, palette) => {
					const colorPallete = palette.DarkVibrant._rgb;
					setRgb(colorPallete);
				});
				setProduct(result.data);
			}

			catch(err){
				console.error(err);
				NotificationManager.error("Product couldn't load!", "Error");
			}
		})();

	}, [setProduct, setRgb, id]);

	const addCart = useCallback(() => {
		if(quantity){
			addToCart(id, quantity)
			.then(() => {
				NotificationManager.success("Successfully added!", "Success");
			})
			.catch(() => {
				console.log(id)
				NotificationManager.error("Couldn't add product to cart!", "Error");
			})
		}
		else{
			NotificationManager.error("Quantity is unknown!", "Error");
		}
	}, [id, quantity]);

	return(

		<div className="product">
			<div className="product__border">
				<div className="product__wrap">
					<img src={ `${productObject.image}_500` } className="product__image" alt=""/>
					<div className="product__info">
						<h1 className="product__title">
						{
							productObject.name
						}
						</h1>
						<div className="product__price">
						<svg className="product__price--svg" xmlns="http://www.w3.org/2000/svg" width="262.1" height="85" viewBox="0 0 262.1 85">
							<g transform="translate(-689 -179)">
								<path d="M0,0H262.1L244.664,42.342,262.1,85H0V0Z" fill={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`} transform="translate(951.1 264) rotate(180)"/>
							</g>
						</svg>
						<span className="product__price--content">
						{
							productObject.price
						}
						€
						</span>
						</div>
						<span className="product__description">
						{
							productObject.description
						}
						</span>
						<input type="number" placeholder="quantity..." name="quantity" className="product__input" onChange={onQuantityChange} required />
						<button className="product__toCart" onClick={addCart}>Add to cart</button>
					</div>
				</div>
			</div>
		</div>

	);
}

export default Product;