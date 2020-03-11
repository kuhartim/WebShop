import React, {useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory} from "react-router-dom";
import {NotificationManager} from 'react-notifications';

import {SessionContext} from "./Login";

import withAuth from "./partial/withAuth";
import { logout as apiLogout, isAdmin as adminCheck, getUser} from "../services/shop.api";

import ProductEditor from "./ProductEditor";

import "./scss/Dashboard.scss";

function Dashboard(){

	const [isAdmin, setIsAdmin] = useState(false);
	const [user, setUser] = useState({});

	const history = useHistory();

	const session = useContext(SessionContext);

	useEffect(() => {

		adminCheck()
		.then(() => {
			setIsAdmin(true);
		})
		.catch(() => {
			setIsAdmin(false);
		});

		try{

		}
		catch(err){
			console.error(err);
		}


	}, [setIsAdmin]);

	const logout = useCallback(() => {
		apiLogout()
		.then(() =>{
			NotificationManager.success("Successfully logged out!", "Success");
			session.setIsLoggedIn(false);
			history.push("/login");
		})
		.catch(() =>{
			NotificationManager.error("Couldn't logout!", "Error");
		})
	}, [history, session]);

	return(

		<div className="dashboard">
			<div className="dashboard__container">
			{
				isAdmin ? (
					<div className="dashboard__adminPanel">
						<h1>Admin panel</h1>
						<ProductEditor />
					</div>
				):(
					<>
					</>
				)
			}
				<button className="dashboard__button dashboard__button--logout" onClick={logout}>Logout</button>
			</div>
		</div>

	);
}

export default withAuth(Dashboard);