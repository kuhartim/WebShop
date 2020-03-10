import React, {useEffect, useState, useCallback} from "react";
import {NotificationManager} from 'react-notifications';
import PropTypes from "prop-types";
import _ from "lodash";


import {listCart, updateCart, deleteCartProduct, emptyCart} from "../services/shop.api";
import withAuth from "./partial/withAuth";

function CartEntry({number, product: { name, price } = {}}){

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
					_.map(cart, ({ product, number, _id }) => <CartEntry key={_id} product={product} number={number} />)
				}
				</tbody>
			</table>
		</div>
	);
}


export default withAuth(Cart);