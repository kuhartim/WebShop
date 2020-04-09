import React, { useState, useCallback, useRef, useEffect} from "react";
import {Link, useHistoty} from "react-router-dom";

import _ from "lodash";

import {allOrders} from "../../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./withAuth";

import "./scss/EditOrders.scss";

function OrderEntry({_id, firstName, lastName, adress, paymentMethod,status}){


	return (
		<tr>
			<td className="order-entry__field">
				{
					firstName.length > 15 ? firstName.substring(0, 15) + "..." : firstName
				}
			</td>
			<td className="order-entry__field">
				{
					lastName.length > 15 ? lastName.substring(0, 15) + "..." : lastName
				}
			</td>
			<td className="order-entry__field">
				{
					adress.length > 15 ? adress.substring(0, 15) + "..." : adress
				}
			</td>
			<td className="order-entry__field">
				{
					paymentMethod
				}
			</td>
			<td className="order-entry__field">
				{
					status
				}
			</td>
			<td>
				<Link to={`/order/${_id}`} className="order-entry__button">View</Link>
			</td>
		</tr>
	);
}


function EditOrders(){

	const [orders, setOrders] = useState([]);
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

		allOrders(page)
			.then(({data: {orders, page, numberAll}}) => {
				setOrders(orders);
				setPage(page);
				setLoading(false);
				setTotalPages(numberAll);
				lastLoadedPage.current = page;
			})
			.catch((err) => {
				const message = _.get(err, "response.data.message", "Couldn't load orders");
				if(message == "Couldn't load orders")
				NotificationManager.error(message, "Error");
			});


	}, [setOrders, page, setPage, setLoading, setTotalPages, loading, totalPages]);

	const ordersPrev = useCallback(() => {
		if(page-1 >= 0){
			setPage(page-1);
		}
	}, [setPage, page]);

	const ordersNext = useCallback(() => {
		if(page+1 <= totalPages){
			setPage(page+1);
		}
	}, [setPage, page, totalPages]);
	


	return(
		<div className="edit-orders">
		<span className="edit-orders__title">Orders</span>
				<div className="edit-orders__tableWrap">
					<table className="edit-orders__orderTable">
						<thead className="edit-orders__orderTable--head">
							<tr>
								<th className="order-entry__field">
									First name
								</th>
								<th className="order-entry__field">
									Last name
								</th>
								<th className="order-entry__field">
									Adress
								</th>
								<th className="order-entry__field">
									Payment method
								</th>
								<th className="order-entry__field">
									Status
								</th>
								<th className="order-entry__field">

								</th>
							</tr>
						</thead>
						<tbody className="edit-orders__orderTable--body">
						{
							orders.map((order) => <OrderEntry key={order._id} {...order} />)
						}	
						</tbody>
					</table>
				</div>
				<div className="edit-orders__buttons">
					<button className={`edit-orders__button edit-orders__prev-next ${page == 1 ? "edit-orders__button--disabled" : ""}`} disabled={page === 1} onClick={ordersPrev}>Prev</button>
					<button className={`edit-orders__button edit-orders__prev-next ${page == totalPages ? "edit-orders__button--disabled" : ""}`} disabled={page === totalPages} onClick={ordersNext}>Next</button>
				</div>
		</div>
	);
}

export default withAuth(EditOrders);
