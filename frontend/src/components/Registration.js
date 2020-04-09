import React, { useState, useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { registration } from "../services/shop.api";
import {NotificationManager} from 'react-notifications';

import {SessionContext} from "./Login";

import { login as apiLogin } from "../services/shop.api";

import "./scss/Registration.scss";

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function Registration(){

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");

	const [disabled, setDisabled] = useState(false);

	const session = useContext(SessionContext);

	const history = useHistory();

	const onEmailChange = useCallback( ({ target: { value } }) => setEmail(value), [setEmail]);

	const onPasswordChange = useCallback( ({ target: { value } }) => setPassword(value), [setPassword]);

	const onRepeatPasswordChange = useCallback( ({ target: { value } }) => setRepeatPassword(value), [setRepeatPassword]);

	const onQuestionChange = useCallback( ({ target: { value } }) => setQuestion(value), [setQuestion]);

	const onAnswerChange = useCallback( ({ target: { value } }) => setAnswer(value), [setAnswer]);


	const register = useCallback(e => {
		e.preventDefault();

		console.log(emailRegEx.test(email));
		console.log(password);

		if(!emailRegEx.test(email)){
			NotificationManager.error("Invalid email", "Error");
			return;
		}

		if(password.length < 8){
			NotificationManager.error("Password too short", "Error");
			return;
		}

		if(password !== repeatPassword){
			NotificationManager.error("Passwords don't match", "Error");
			return;
		}

		setDisabled(true);

		registration(email, password, repeatPassword, question, answer)
			.then(() => {
				NotificationManager.success("Successfully registered", "Success");
				setDisabled(false);
					apiLogin(email, password)
						.then(() => {
							session.setIsLoggedIn(true);
							setDisabled(false);
							history.push("/dashboard");
						})
						.catch(() => {
							NotificationManager.error("Login failed", "Error");
							setDisabled(false);
						});

			})
			.catch(() => {
				NotificationManager.error("Registration failed", "Error");
				setDisabled(false);
			});
	}, [setDisabled, email, password, repeatPassword, question, answer, session]);

	return (
		<div className="registration">
			<form method="POST">
				<fieldset className="registration__fieldset" disabled={ disabled } >
					<input type="email" className="registration__field" name="email" placeholder="Email*" value={ email } onChange={ onEmailChange } required/>
					<input type="password" className="registration__field" name="password" placeholder="Password*" value={ password } onChange={ onPasswordChange } required/>
					<input type="password" className="registration__field" name="password_repeat" placeholder="Repeat password*" value={ repeatPassword } onChange={ onRepeatPasswordChange } required/>
					<input type="text" className="registration__field" name="question" placeholder="Your Question" value={ question } onChange={ onQuestionChange }/>
					<textarea type="text" className="registration__field registration__field--textarea" name="answer" placeholder="Your Answer" value={ answer } onChange={ onAnswerChange } />
					<button type="submit" className="registration__button registration__button--primary" onClick={ register }>Register</button>
					<Link to="/login" className="registration__button registration__button--secondary">Login</Link>
				</fieldset>
			</form>
		</div>
	);

}

export default Registration;