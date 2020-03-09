import React from "react";
import { Link } from "react-router-dom";

import withAuth from "./partial/withAuth";

import "./scss/Product.scss";

function Dashboard(){

	return(

		<>
		<Link to="/producteditor">CLICK</Link>
		</>

	);
}

export default withAuth(Dashboard);