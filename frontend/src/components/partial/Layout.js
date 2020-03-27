import React, { useContext, useState } from "react";
import ReactDOM from 'react-dom';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import Nav from "./Nav";
import Footer from "./Footer";
import {NotificationContainer} from 'react-notifications';

import { SessionContext } from "../Login";
import  OrderContext from "./OrderContext";

import 'react-notifications/lib/notifications.css';

const stripePromise = loadStripe("pk_test_Viatv56TmaSOcY0V5LWOsCAa00IxC041ed");

function Layout({ children }) { 

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (

		<Elements stripe={stripePromise}>
		<OrderContext>
			<SessionContext.Provider value={ { isLoggedIn, setIsLoggedIn } } >
				<Nav className="layout__nav" />
				{ children }
				<Footer className="layout__footer" />
				<NotificationContainer />
			</SessionContext.Provider>
		</OrderContext>
		</Elements>

	);
}

export default Layout;