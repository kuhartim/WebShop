import React, { useState, useCallback } from "react";

import CartProgress from "./partial/CartProgress";

import "./scss/Adress.scss";

function Adress(){

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [adress, setAdress] = useState("");
	const [post, setPost] = useState("");
	const [city, setCity] = useState("");
	const [phone, setPhone] = useState("");

	const [disabled, setDisabled] = useState(false);

	const onFirstNameChange = useCallback(({target: {value}}) => setFirstName(value), [setFirstName]);
	const onLastNameChange = useCallback(({target: {value}}) => setLastName(value), [setLastName]);
	const onAdressChange = useCallback(({target: {value}}) => setAdress(value), [setAdress]);
	const onPostChange = useCallback(({target: {value}}) => setPost(value), [setPost]);
	const onCityChange = useCallback(({target: {value}}) => setCity(value), [setCity]);
	const onPhoneChange = useCallback(({target: {value}}) => setPhone(value), [setPhone]);

	

	return(
		<div className="adress">
			<CartProgress />
			<div className="adress__form">
			<form method="POST">
				<fieldset disabled={disabled}>
					<input type="text" className="adress__field" name="firstName" placeholder="First name" value={firstName} onChange={onFirstNameChange}/>
					<input type="text" className="adress__field" name="lastName" placeholder="Last name" value={lastName} onChange={onLastNameChange}/>
					<input type="text" className="adress__field" name="adress" placeholder="Adress" value={adress} onChange={onAdressChange}/>
					<input type="number" className="adress__field" name="post" placeholder="Postal code" value={post} onChange={onPostChange}/>
					<input type="text" className="adress__field" name="city" placeholder="City" value={city} onChange={onCityChange}/>
					<input type="tel" className="adress__field" name="phone" placeholder="Phone" value={phone} onChange={onPhoneChange}/>
					<button type="submit">KLIK</button>
				</fieldset>
			</form>
			</div>
		</div>
	);
}

export default Adress;