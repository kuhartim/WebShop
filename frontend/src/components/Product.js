import React from "react";

import "./scss/Product.scss";

function Product({ match: { params: { product: id } } }){

	return(

		<div className="product">
			<h1>{id}</h1>
			<p></p>
			<span></span>
		</div>

	);
}

export default Product;