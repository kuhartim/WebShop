import React, { useState, useCallback, useRef, useEffect } from "react";
import {Link, useHistoty} from "react-router-dom";

import _ from "lodash";

import "./scss/EditUsers.scss";

import { getAllUsers, deleteUser } from "../../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./withAuth";

function UserEntry({_id, email, type, setTrigger}){

	const [loading, setLoading] = useState(false);

	const deleteThisUser = useCallback(() => {

		if(loading) return;

		setLoading(true);


		deleteUser(_id)
		.then(() => {
			NotificationManager.success("Successfully deleted!", "Success");
			setLoading(false);
			setTrigger(trigger => !trigger);
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete this user!", "Error");
			setLoading(false);
		})


	}, [setLoading, loading, _id, setTrigger]);

	return (
		<tr>
			<td className="user-entry__field">
				{
					email.length > 30 ? email.substring(0, 30) + "..." : email
				}
			</td>
			<td className="user-entry__field">
				{
					type
				}
			</td>
			<td className="user-entry__field--button">
				<button className="user-entry__button user-entry__button--delete" onClick={deleteThisUser}>Delete</button>
			</td>
		</tr>
	);
}



function Editusers(){

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);


	const [totalPages, setTotalPages] = useState(1);
	const lastLoadedPage = useRef(0);

	const [trigger, _setTrigger] = useState(false);
	const setTrigger = useCallback((value) => {
		lastLoadedPage.current = 0;
		_setTrigger(value);
	}, [lastLoadedPage, _setTrigger]);

	useEffect(() => {

		if((page > totalPages || page == lastLoadedPage.current) || loading) return;

		setLoading(true);

		getAllUsers(page)
			.then(({data: {users, page, numberAll}}) => {
				setUsers(users);
				setPage(page);
				setLoading(false);
				setTotalPages(numberAll);
				lastLoadedPage.current = page;
			})
			.catch(err => {
				const message = _.get(err, "response.data.message", "Couldn't load users");
				if(message == "Couldn't load users")
				NotificationManager.error(message, "Error");
				console.log(err);
			});
	}, [page, setUsers, setPage, totalPages, setTotalPages, trigger]);
	

	const usersPrev = useCallback(() => {
		if(page-1 >= 0){
			setPage(page-1);
		}
	}, [setPage, page]);

	const usersNext = useCallback(() => {
		if(page+1 <= totalPages){
			setPage(page+1);
		}
	}, [setPage, page, totalPages]);

	return(
			<div className="edit-users">
			<span className="edit-users__title">users</span>
					<div className="edit-users__tableWrap">
						<table className="edit-users__usersTable">
							<thead className="edit-users__usersTable--head">
								<tr>
									<th>
										Mail
									</th>
									<th>
										Type
									</th>
									<th>

									</th>
								</tr>
							</thead>
							<tbody className="edit-users__usersTable--body">
							{
								users.map((usersObject) => <UserEntry key={usersObject._id} setTrigger={setTrigger} {...usersObject} />)
							}	
							</tbody>
						</table>
					</div>
				<div className="edit-users__buttons">
					<button className={`edit-users__button edit-users__prev-next ${page == 1 ? "edit-users__button--disabled" : ""}`} disabled={page === 1} onClick={usersPrev}>Prev</button>
					<button className={`edit-users__button edit-users__prev-next ${page == totalPages ? "edit-users__button--disabled" : ""}`} disabled={page === totalPages} onClick={usersNext}>Next</button>
				</div>
			</div>
	);
}

export default withAuth(Editusers);
