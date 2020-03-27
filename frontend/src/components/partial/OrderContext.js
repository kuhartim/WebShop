import React, {useState} from "react";

export const OrderContext = React.createContext(null);

function Wrapper(props){

	const [order, setOrder] = useState(null);

	return (
		<OrderContext.Provider value={{order, setOrder}}>
		{
			props.children
		}
		</OrderContext.Provider>
	);
}

export default Wrapper;