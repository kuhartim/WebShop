import React, { useState, useCallback, useContext, useEffect } from "react";
import {useHistory} from "react-router-dom";
import {NotificationManager} from 'react-notifications';

import {newOrder, readOrder} from "../services/shop.api";

import withCurrentOrder from "./partial/withCurrentOrder";

import CartProgress from "./partial/CartProgress";

import { OrderContext } from "./partial/OrderContext";

import "./scss/Adress.scss";

function Adress(){

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [adress, setAdress] = useState("");
	const [post, setPost] = useState("");
	const [city, setCity] = useState("");
	const [phone, setPhone] = useState("");

	const [disabled, setDisabled] = useState(false);

	const history = useHistory();

	const onFirstNameChange = useCallback(({target: {value}}) => setFirstName(value), [setFirstName]);
	const onLastNameChange = useCallback(({target: {value}}) => setLastName(value), [setLastName]);
	const onAdressChange = useCallback(({target: {value}}) => setAdress(value), [setAdress]);
	const onPostChange = useCallback(({target: {value}}) => setPost(value), [setPost]);
	const onCityChange = useCallback(({target: {value}}) => setCity(value), [setCity]);
	const onPhoneChange = useCallback(({target: {value}}) => setPhone(value), [setPhone]);

	const orderContext = useContext(OrderContext);

	useEffect(() => {

		readOrder("created")
		.then(({data: {order}}) => {
			setFirstName(order.firstName);
			setLastName(order.lastName);
			setAdress(order.adress);
			setPost(order.postalCode);
			setCity(order.city);
			setPhone(order.phone);
		})
		.catch(() => {
			console.log("no existing order");
		})

	}, [setFirstName, setLastName, setAdress, setPost, setCity, setPhone]);

	const next = useCallback(() => {

		setDisabled(true);

		newOrder(firstName, lastName, adress, post, city, phone)
		.then(({data: order}) => {
			NotificationManager.success("Adress saved!", "success");
			setDisabled(false);
			orderContext.setOrder(order);
			history.push('/payment');
		})
		.catch(() => {
			NotificationManager.error("Couldn't save adress!", "Error");
			setDisabled(false);
		})
		
	}, [orderContext, history, firstName, lastName, adress, post, city, phone, setDisabled]);

	const prev = useCallback(() => {

		setDisabled(true);

		newOrder(firstName, lastName, adress, post, city, phone)
		.then(({data: order}) => {
			NotificationManager.success("Adress saved!", "success");
			setDisabled(false);
			orderContext.setOrder(order);
			history.push('/cart');
		})
		.catch(() => {
			NotificationManager.warning("You must fill all required inputs to save it!", "Warning");
			setDisabled(false);
			history.push('/cart');
		})
		
	}, [history]);

	return(
		<div className="adress">
			<CartProgress />
			<h1>Adress</h1>
			<div className="adress__form--wrap">
			<form method="POST" className="adress__form">
				<fieldset disabled={disabled} className="adress__fieldset">
					<input type="text" className="adress__field" name="firstName" placeholder="*First name" value={firstName} onChange={onFirstNameChange}/>
					<input type="text" className="adress__field" name="lastName" placeholder="*Last name" value={lastName} onChange={onLastNameChange}/>
					<input type="text" className="adress__field" name="adress" placeholder="*Adress" value={adress} onChange={onAdressChange}/>
					<input type="number" className="adress__field" name="post" placeholder="*Postal code" value={post} onChange={onPostChange}/>
					<input type="text" className="adress__field" name="city" placeholder="*City" value={city} onChange={onCityChange}/>
					<input type="tel" className="adress__field" name="phone" placeholder="Phone" value={phone} onChange={onPhoneChange}/>
				</fieldset>
			</form>
			</div>
			<div className="adress__buttons">
				<button className="adress__button adress__button--cart" onClick={prev}>Cart</button>
				<button className="adress__button adress__button--payment" onClick={next}>Payment</button>
			</div>
		</div>
	);
}

export default withCurrentOrder(Adress);