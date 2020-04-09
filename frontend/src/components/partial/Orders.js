import React, {useState, useRef, useEffect, useCallback} from "react";

import {NotificationManager} from "react-notifications";

import _ from "lodash";

import withAuth from "./withAuth";

import {readUserOrders as apiOrders} from "../../services/shop.api";

import "./scss/Orders.scss";


function OrderEntry({firstName, lastName, adress, paymentMethod, status, price}){


	return (
		<tr className="orders-entry">
			<td className="orders-entry__field">
				{
					firstName.length > 15 ? firstName.substring(0, 15) + "..." : firstName
				}
			</td>
			<td className="orders-entry__field">
				{
					lastName.length > 15 ? lastName.substring(0, 15) + "..." : lastName
				}
			</td>
			<td className="orders-entry__field">
				{
					adress.length > 15 ? adress.substring(0, 15) + "..." : adress
				}
			</td>
			<td className="orders-entry__field">
				{
					paymentMethod == "stripe" ? "credit card" : paymentMethod == "pickup" ? "Payment upon delivery" : paymentMethod
				}
			</td>
			<td className="orders-entry__field">
				{
					status
				}
			</td>
			<td className="orders-entry__field">
				{
					price
				}
			</td>
		</tr>
	);
}


function Orders(){

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const [totalPages, setTotalPages] = useState(1);
	const lastLoadedPage = useRef(0);


	useEffect(() => {

		if((page > totalPages || page == lastLoadedPage.current) || loading) return;

		setLoading(true);

		apiOrders(page)
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
		<div className="orders">
		<span className="orders__title">My orders</span>
			<div className="orders__tableWrap">
				<table className="orders__orderTable">
					<thead className="orders__orderTable--head">
						<tr>
							<th className="orders-entry__field">
								First name
							</th>
							<th className="orders-entry__field">
								Last name
							</th>
							<th className="orders-entry__field">
								Adress
							</th>
							<th className="orders-entry__field">
								Payment method
							</th>
							<th className="orders-entry__field">
								Status
							</th>
							<th className="orders-entry__field">
								Price
							</th>
						</tr>
					</thead>
					<tbody className="orders__orderTable--body">
					{
						orders.map((order) => <OrderEntry key={order._id} {...order} />)
					}	
					</tbody>
				</table>
			</div>
		<div className="orders__buttons">
			<button className={`orders__button ${page == 1 ? "orders__button--disabled" : ""}`} disabled={page === 1} onClick={ordersPrev}>Prev</button>
			<button className={`orders__button ${page == totalPages ? "orders__button--disabled" : ""}`} disabled={page === totalPages} onClick={ordersNext}>Next</button>
		</div>
		</div>
	);
}

export default withAuth(Orders);