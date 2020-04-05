import React, { useState, useCallback, useRef, useEffect, useContext } from "react";

import withAuth from "./partial/withAuth";

import EditProduct from "./partial/EditProduct";
import EditOrders from "./partial/EditOrders";
import EditNews from "./partial/EditNews";


import "./scss/AdminPanel.scss";



function AdminPanel(){

	

	return(
		<div className="adminPanel">
			<EditProduct />
			<EditOrders />
			<EditNews />
		</div>
	);
}

export default withAuth(AdminPanel);