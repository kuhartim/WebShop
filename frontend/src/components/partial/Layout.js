import React, { useContext, useState } from "react";

import Nav from "./Nav";
import {NotificationContainer} from 'react-notifications';

import { SessionContext } from "../Login";

import 'react-notifications/lib/notifications.css';

function Layout({ children }) { 

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (

		<SessionContext.Provider value={ { isLoggedIn, setIsLoggedIn } } >
			<Nav />
			{ children }
			<NotificationContainer />
		</SessionContext.Provider>

	);
}

export default Layout;