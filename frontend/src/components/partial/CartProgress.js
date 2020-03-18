import React from "react";
import {useLocation} from "react-router-dom";

import "./scss/CartProgress.scss";

function CartProgress(){

 	const location = useLocation();

 	console.log(location.pathname);

 	let step2 = false;
 	let step3 = false;
 	let step4 = false;

 	switch(location.pathname){
 		case "/adress":
 			step2 = true;
 			break;
 		case "/payment":
 			step2 = step3 = true;
 			break;
 		case "/finish":
 			step2 = step3 = step4 = true;
 			break;
 	}

	return (
		<div className="cart-progress">
		 	<div className="cart-progress__step cart-progress__step--active">1</div>
		 	<div className="cart-progress__arrow-wrap"><div className="cart-progress__arrow"></div></div>
		 	<div className={`cart-progress__step ${ step2 ? "cart-progress__step--active" : ""}`}>2</div>
		 	<div className="cart-progress__arrow-wrap"><div className="cart-progress__arrow"></div></div>
		 	<div className={`cart-progress__step ${ step3 ? "cart-progress__step--active" : ""}`}>3</div>
		 	<div className="cart-progress__arrow-wrap"><div className="cart-progress__arrow"></div></div>
		 	<div className={`cart-progress__step ${ step4 ? "cart-progress__step--active" : ""}`}>4</div>
		</div>
	);
}

export default CartProgress;