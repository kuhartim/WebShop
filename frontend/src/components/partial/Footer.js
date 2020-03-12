import React, {useState, useCallback} from "react";
import {NotificationManager} from "react-notifications";

import {signUpToNews as apiSignUp, newsMailCheck} from "../../services/shop.api";

import "./scss/Footer.scss";

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function Footer(){

	const [email, setEmail] = useState("");
	const [disabled, setDisabled] = useState(false);

	const onEmailChange = useCallback(({ target: { value } }) => setEmail(value), [setEmail]);

	const signUp = useCallback(e => {
		e.preventDefault();

		if(!emailRegEx.test(email)){
			NotificationManager.error("Invalid email!", "Error");
			return;
		}

		newsMailCheck(email)
		.then(() => {
			setDisabled(true);

			apiSignUp(email)
				.then(() => {
					NotificationManager.success("Sign up successful", "Success");
					setDisabled(false);
				})
				.catch(() => {
					NotificationManager.error("Sign up failed", "Error");
					setDisabled(false);
				});
		})
		.catch(() => {
			NotificationManager.error("Mail already exist!", "Error");
		});


	}, [email, setDisabled]); 

	return(
		<div className="footer">
			<div className="footer__inform">
				<span className="footer__title">Be informed</span>
				<span className="footer__subtitle">Stay up-to-date with news and benefits</span>
				<form method="POST">
					<fieldset className="footer__fieldset" disabled={ disabled }>
						<input type="email" className="footer__field" name="email" placeholder="Email" value={ email } onChange={ onEmailChange } required />
						<button type="submit" className="footer__button" onClick={signUp}>Sign up</button>
					</fieldset>
				</form>
			</div>
			<div className="footer__contacts">
			</div>
		</div>
	);
}

export default Footer;