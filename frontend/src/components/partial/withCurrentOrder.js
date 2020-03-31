import React, {useEffect, useContext, useRef} from "react";
import {useLocation} from "react-router-dom";

import {OrderContext} from "./OrderContext";

import {readOrder} from "../../services/shop.api";

function withCurrentOrder(Component){

	return (props) => {

		const orderContext = useContext(OrderContext);

		const loading = useRef(true);

		const location = useLocation();

		useEffect(() => {

			if(!loading.current) return;
			
			readOrder(location.pathname == "/finish" ? "waitingForPayment" : "created")
			.then(({data}) => {
				orderContext.setOrder(data.order);
				loading.current = false;
				console.log(orderContext);
			})
			.catch(err => {
				console.log(err);
				loading.current = false;
			});

		}, [loading, orderContext])

		return <Component {...props} order={orderContext.order} />;
		
	};
}

export default withCurrentOrder;