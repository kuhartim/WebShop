import React, { useState, useCallback, useRef, useEffect, useContext } from "react";

import withAuth from "./withAuth";

import EditProduct from "./EditProduct";
import EditOrders from "./EditOrders";
import EditNews from "./EditNews";
import EditUsers from "./EditUsers";


import "./scss/AdminPanel.scss";



function AdminPanel(){

	

	return(
		<div className="adminPanel">
			<EditProduct />
			<EditOrders />
			<EditNews />
			<EditUsers />
		</div>
	);
}

export default withAuth(AdminPanel);