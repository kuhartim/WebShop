import React, {useState, useCallback, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {NotificationManager} from "react-notifications";

import {changePassword as apiPasswordChange} from "../../services/shop.api";

import "./scss/ChangePassword.scss";

function ChangePassword({email, answer}){

	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const [disabled, setDisabled] = useState(false);

	const history = useHistory();

	const onPasswordChange = useCallback( ({ target: { value } }) => setPassword(value), [setPassword]);
	const onRepeatPasswordChange = useCallback( ({ target: { value } }) => setRepeatPassword(value), [setRepeatPassword]);


	const changePassword = useCallback(() => {

		if(password.length < 8){
			NotificationManager.error("Password too short", "Error");
			return;
		}

		if(password !== repeatPassword){
			NotificationManager.error("Passwords don't match", "Error");
			return;
		}

		apiPasswordChange(email, answer, password)
		.then(() => {
			NotificationManager.success("Password changed!", "Success");
			history.push('/login');
		})
		.catch(() => {
			NotificationManager.error("Couldn't change password", "Error");
		})

	}, [password, repeatPassword, email, answer, history]);

	return(
		<div className="change-password">
			<fieldset className="change-password__fieldset" disabled={disabled}>
				<input type="password" className="change-password__field" name="password" placeholder="Password*" value={ password } onChange={ onPasswordChange } required/>
				<input type="password" className="change-password__field" name="password_repeat" placeholder="Repeat password*" value={ repeatPassword } onChange={ onRepeatPasswordChange } required/>
				<button className="change-password__button" type="submit" onClick={changePassword}>Change</button>
			</ fieldset>
		</div>
	);
}

export default ChangePassword;