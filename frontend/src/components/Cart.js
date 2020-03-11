import React, {useEffect, useState, useCallback} from "react";
import {NotificationManager} from 'react-notifications';
import PropTypes from "prop-types";
import _ from "lodash";


import {listCart, updateCart, deleteCartProduct, emptyCart} from "../services/shop.api";
import withAuth from "./partial/withAuth";

function CartEntry({number, cartId, product: { _id: id, name, price } = {}}){

	const deleteProduct = useCallback(() => {
		deleteCartProduct(cartId)
		.then(() => {
			NotificationManager.success("Successfully deleted!", "Success");
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete product from cart!", "Error");
		})
	}, [cartId]);

	return (
		<tr>
			<td>
				{name}
			</td>
			<td>
				{number}
			</td>
			<td>
				{price}€ * {number}
			</td>
			<td>
				<button onClick={deleteProduct}>X</button>
			</td>
		</tr>
	);
}

CartEntry.propTypes = {
	number: PropTypes.number.isRequired,
	product: PropTypes.shape({
		name: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired
	}).isRequired

}


function Cart(){

	const [cart, setCart] = useState([]);

	useEffect(()=>{

		(async () => {
			try{
				const {data: products} = await listCart();
				setCart(products);
			}

			catch(err){
				console.error(err);
				NotificationManager.error("Cart couldn't load!", "Error");
			}
		})();


	}, [setCart]);

	const deleteAll = useCallback(() => {
		emptyCart()
		.then(() => {
			NotificationManager.success("Successfully deleted!", "Success");
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete products from cart!", "Error");
		});

		setCart([]);
	}, [])


	return(
		<div>
			<table>
				<thead>
					<tr>
						<th>
							Product
						</th>
						<th>
							Price
						</th>
						<th>
							Quantity
						</th>
						<th>

						</th>
					</tr>
				</thead>
				<tbody>
				{
					_.map(cart, ({ product, number, _id }) => <CartEntry key={_id} product={product} number={number} cartId={_id} />)
				}
				</tbody>
			</table>
			<button onClick={deleteAll}>Delete all</button>
		</div>
	);
}


export default withAuth(Cart);