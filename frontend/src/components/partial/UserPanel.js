import React from "react";

import withAuth from "./withAuth";

import Orders from "./Orders";

import "./scss/UserPanel.scss";

function UserPanel(){

	return (
		<div className="userPanel">
			<Orders />
		</div>
	);
}

export default withAuth(UserPanel);