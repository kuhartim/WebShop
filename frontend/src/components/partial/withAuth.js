import React, { useMemo, useContext } from "react";
import { useHistory } from "react-router-dom";

import { recoverToken, isLoggedIn } from "../../services/shop.api";
import { SessionContext } from "../Login";

function withAuth(Component, silent){

	return (props) => {

		const session = useContext(SessionContext);

		const history = useHistory();

		const hasToken = useMemo(() => {
			if(!isLoggedIn()){

				if(recoverToken()){
					session.setIsLoggedIn(true);
				}
				else{
					history.push("/login");
					return false;
				}
			}

			return true;
		}, [history, session]);

		return hasToken || silent ? <Component {...props} /> : null;
	};
}

export default withAuth;