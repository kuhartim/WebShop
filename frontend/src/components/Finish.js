import React, {useContext, useEffect, useCallback} from "react";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import CartProgress from "./partial/CartProgress";

import {deleteCart, updateOrderStatus as apiStatus} from "../services/shop.api";

import withCurrentOrder from "./partial/withCurrentOrder";

import "./scss/Finish.scss";

function Finish({order}){

	const history = useHistory();


	useEffect(() => {

		if(!order){
			history.push('/cart');
			return;
		}

		console.log(order);

		deleteCart()
		.then(() => {
			
		})
		.catch(() => {
			NotificationManager.error("Couldn't delte cart!", "Error");
		})


	}, [order, history]);

	const redirect = useCallback(() => {
		history.push('/products');
	}, [history]);

	return(
		<div className="finish">
			<CartProgress />
			<div className="finish__text--wrap">
				<span className="finish__text">Thank you for your purchase!</span>
				<button className="finish__button" onClick={redirect}>Back to product page</button>
			</div>
			{
				order && order.paymentMethod == "upn" ?
			<div className="finish__table">
				<span className="finish__table--title">Naziv:</span>
				<span className="finish__table--text"> TiKu d.o.o </span>
				<span className="finish__table--title">Naslov:</span>
				<span className="finish__table--text"> 
					Vegova ulica 4,
					1000 Ljubljana,
					Slovenia
				</span>
				<span className="finish__table--title">IBAN:</span>
				<span className="finish__table--text">SI95169313631776127</span>
				<span className="finish__table--title">BIC:</span>
				<span className="finish__table--text">SKBASI2X</span>
				<span className="finish__table--title">Namen:</span>
				<span className="finish__table--text">Plačilo naročila</span>
				<span className="finish__table--title">Znesek:</span>
				<span className="finish__table--price">
				{
					order ? order.price + "€" : ""
				}
				</span>
			</div> :
			<></>
			}
		</div>
	)
}

export default withCurrentOrder(Finish);