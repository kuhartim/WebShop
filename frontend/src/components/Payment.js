import React, { useState, useCallback, useContext, useEffect } from "react";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

import CartProgress from "./partial/CartProgress";

import {updateOrder} from "../services/shop.api";

import withCurrentOrder from "./partial/withCurrentOrder";

import { OrderContext } from "./partial/OrderContext";

import CheckoutForm from "./partial/StripeCheckoutForm";

import "./scss/Payment.scss";

function Payment(){

	const [paymentMethod, setPaymentMethod] = useState("");

	const [stripe, setStripe] = useState(null);

	const [disabled, setDisabled] = useState(false);

	const onPaymentMethodChange = useCallback(({target: {value}}) => setPaymentMethod(value), [setPaymentMethod]);

	const history = useHistory();

	const orderContext = useContext(OrderContext);

	useEffect(() => {

		if(!orderContext.order){
			history.push('/cart');
		}
	}, [orderContext, history]);

	const next = useCallback(() => {

		if(!paymentMethod){

			NotificationManager.error("You must choose payment method", "Error");
			return;
		}

		setDisabled(true);

		updateOrder(orderContext.order._id, paymentMethod)
		.then(({data: {stripeSecret}}) => {
			NotificationManager.success("Order Completed!", "Success");
			setDisabled(false);
			if(!stripeSecret)
				history.push('/finish');
			setStripe(stripeSecret);
		})
		.catch(() => {
			setDisabled(false);
			NotificationManager.error("Something went wrong during order completing!", "Error");
		});

	}, [history, setDisabled, paymentMethod, orderContext, setStripe])

	const prev = useCallback(() => {
		history.push('/adress');
	}, [history])
	

	return(
		<div className="payment">
			<CartProgress />
			<h1>Payment</h1>
			<div className="payment__form--wrap">
			<form method="POST" className="payment__form">
				<fieldset className="payment__fieldset" disabled={disabled}>
					<label htmlFor="pickup" className="payment_label">
						<input id="pickup" type="radio" name="payment-method" className="payment_paymentMethod" value="pickup" onChange={onPaymentMethodChange} required />
						&nbsp;Payment upon delivery
					</label>
					<label htmlFor="upn" className="payment_label">
						<input id="upn" type="radio" name="payment-method" className="payment_paymentMethod" value="upn" onChange={onPaymentMethodChange} required />
						&nbsp;UPN
					</label>
					<label htmlFor="credit-card" className="payment_label">
						<input id="credit-card" type="radio" name="payment-method" className="payment_paymentMethod" value="stripe" onChange={onPaymentMethodChange} required />
						&nbsp;Credit card
					</label>
				</fieldset>
			</form>
			{ stripe ?
				<CheckoutForm secret={stripe} />
				:
				""
			}
			</div>
			<div className="payment__buttons">
				<button className="payment__button payment__button--adress" onClick={prev}>Adress</button>
				<button className="payment__button payment__button--finish" onClick={next}>Finish</button>
			</div>
		</div>
	);
}

export default withCurrentOrder(Payment);