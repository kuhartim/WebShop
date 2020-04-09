import React, {useState, useCallback} from "react";
import {NotificationManager} from "react-notifications";

import {userExist} from "../../services/shop.api";

import "./scss/ForgotEmailCheck.scss";

//https://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function ForgotEmailCheck({setStep, setQuestion, email, setEmail}){

	const [disabled, setDisabled] = useState(false);

	const onEmailChange = useCallback(({ target: { value } }) => setEmail(value), [setEmail]);

	const checkMail = useCallback(() => {

		if(!emailRegEx.test(email)){
			NotificationManager.error("This is not a valid email", "Error");
			return;
		}

		setDisabled(true);

		userExist(email)
		.then(({data: question}) => {
			NotificationManager.success("User found", "Success");
			setStep(2);
			setDisabled(false);
			setQuestion(question);
		})
		.catch(() => {
			NotificationManager.error("User doesn't exist", "Error");
			setDisabled(false);
		});

	}, [email, setStep, setDisabled, setQuestion]);

	return(
		<div className="forgot-email-check">
				<fieldset className="forgot-email-check__fieldset" disabled={ disabled } >
					<input type="email" className="forgot-email-check__field" name="email" placeholder="Email" value={ email } onChange={ onEmailChange } required/>
					<button className="forgot-email-check__button" onClick={checkMail} >Next</button>
				</fieldset>
		</div>
	)
}

export default ForgotEmailCheck;