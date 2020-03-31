import React, {useContext, useEffect, useCallback} from "react";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import CartProgress from "./partial/CartProgress";

import {deleteCart} from "../services/shop.api";

import withCurrentOrder from "./partial/withCurrentOrder";

import { OrderContext } from "./partial/OrderContext";

import "./scss/Finish.scss";

function Finish(){

	const history = useHistory();

	const orderContext = useContext(OrderContext);

	useEffect(() => {

		if(!orderContext.order){
			history.push('/cart');
			return;
		}

		deleteCart()
		.then(() => {
			
		})
		.catch(() => {
			NotificationManager.error("Couldn't delte cart!", "Error");
		})


	}, [orderContext, history]);

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
		</div>
	)
}

export default withCurrentOrder(Finish);