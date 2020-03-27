import React, {useEffect, useContext, useRef} from "react";

import {OrderContext} from "./OrderContext";

import {readOrder} from "../../services/shop.api";

function withCurrentOrder(Component){

	return (props) => {

		const orderContext = useContext(OrderContext);

		const loading = useRef(true);

		useEffect(() => {

			if(!loading.current) return;
			
			readOrder()
			.then(({data}) => {
				orderContext.setOrder(data.order);
				loading.current = false;
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