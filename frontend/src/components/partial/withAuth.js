import React, { useMemo, useContext } from "react";
import { useHistory } from "react-router-dom";

import { recoverToken, isLoggedIn } from "../../services/shop.api";
import { SessionContext } from "../Login";

function withAuth(Component){

	return (props) => {

		const session = useContext(SessionContext);

		const history = useHistory();

		const hasToken = useMemo(() => {
			if(!isLoggedIn() && !recoverToken()){

				history.push("/login");
				return false;
			}

			session.setIsLoggedIn(true);

			return true;
		}, [history, session]);

		return hasToken ? <Component {...props} /> : null;
	};
}

export default withAuth;