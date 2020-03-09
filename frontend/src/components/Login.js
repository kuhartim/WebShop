import React, { useState, useCallback, useContext, useEffect } from "react";
import {Link, useHistory} from "react-router-dom";

import { login as apiLogin, recoverToken } from "../services/shop.api";
import {NotificationManager} from 'react-notifications';

import "./scss/Login.scss";

//https://emailregex.com/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const SessionContext = React.createContext({ isLoggedIn: false, setIsLoggedIn: null });

function Login(){

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [disabled, setDisabled] = useState(false);

	const session = useContext(SessionContext);

	const history = useHistory();

	const onEmailChange = useCallback(({ target: { value } }) => setEmail(value), [setEmail]);
	const onPasswordChange = useCallback(({ target: { value } }) => setPassword(value), [setPassword]);
	const login = useCallback(e => {
		e.preventDefault();

		if(!emailRegEx.test(email) || password.length < 8){
			NotificationManager.error("Invalid email or password too short", "Error");
			return;
		}

		setDisabled(true);

		apiLogin(email, password)
			.then(() => {
				NotificationManager.success("Login successful", "Success");
				session.setIsLoggedIn(true);
				setDisabled(false);
				history.push("/dashboard");
			})
			.catch(() => {
				NotificationManager.error("Login failed", "Error");
				setDisabled(false);
			});

	}, [email, setDisabled, password, history]); 

	useEffect(() => {
		if(recoverToken()) history.push("/dashboard");
	}, [history]);

	return(

		<div className="login">
			<form method="POST">
				<fieldset className="login__fieldset" disabled={ disabled } >
					<input type="email" className="login__field" name="email" placeholder="Email" value={ email } onChange={ onEmailChange } required/>
					<input type="password" className="login__field" name="password" placeholder="Password" value={ password } onChange={ onPasswordChange } required/>
					<button type="submit" className="login__button login__button--primary" onClick={ login }>Login</button>
					<Link to="/register" className="login__button login__button--secondary">Register</Link>
					<Link to="/forgot" type="button" className="login__button login__button--secondary">Forgot password?</Link>
				</fieldset>
			</form>
		</div>
	);

}


export default Login;