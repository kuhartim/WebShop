import React, { useState, useCallback, useContext } from "react";
import {Link, useHistory } from "react-router-dom";

import withAuth from "./withAuth";

import {SessionContext} from "../Login";

import burger from "../images/burger.svg"; 

import "./scss/Nav.scss";


function Nav() {

	const [open, setOpen] = useState(false);

	const {isLoggedIn} = useContext(SessionContext);

	const history = useHistory();

	const onclick = useCallback(e => {
		e.preventDefault();
		setOpen(open => !open);
	}, []);

	/*const close = useCallback(e => {
		e.preventDefault();
		setOpen(open => false);
		history.push(this.getAttribute('to'));
	}, []);*/

	return (

		<nav className={`nav ${open ? "" : "nav--closed"}`}>
			<span className="nav__logo">TIKU</span>
			<Link to="#" title="Toggle menu" className="nav__burger" onClick={onclick}>
				<img src={burger} width={64} alt="Toggle menu"/>
			</Link>
			<ul className={`nav__links ${open ? "" : "nav__links--closed"}`}>
				<li>
					<Link to="/" title="Home" className="nav__link" /*onClick={close}*/>Home</Link>
				</li>
				<li>
					<Link to="/products" title="Products" className="nav__link" /*onClick={close}*/>Products</Link>
				</li>
				<li>
					<Link to="/about" title="About" className="nav__link" /*onClick={close}*/>About</Link>
				</li>

				{ isLoggedIn?(
					<li>
						<Link to="/dashboard" title="Dashboard" className="nav__link" /*onClick={close}*/>Dashboard</Link>
					</li>
					):(
					<>
						<li>
							<Link to="/login" title="Login" className="nav__link" /*onClick={close}*/>Login</Link>
						</li>
						<li>
							<Link to="/registration" title="Login" className="nav__link" /*onClick={close}*/>Registration</Link>
						</li>
					</>
				)}
			</ul>
		</nav>

	);
}

export default withAuth(Nav, true);