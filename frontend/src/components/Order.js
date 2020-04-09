import React, {useEffect, useState, useCallback} from "react";
import {useHistory} from "react-router-dom";
import {NotificationManager} from "react-notifications";

import { readOrderById as apiOrder, updateOrderStatus as apiStatus, deleteOrder } from "../services/shop.api";

import "./scss/Order.scss"

function Order({ match: { params: { order: id } } }) {

	const [order, setOrder] = useState({});
	const [trigger, setTrigger] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);

	const history = useHistory();

	useEffect(() => {

		apiOrder(id)
			.then(({data: order}) => {
				setOrder(order);
			})
			.catch(() => {
				NotificationManager.error("Order couldn't load!", "Error");
			})

	}, [id, setOrder, trigger])

	const changeStatus = useCallback(status => {

		if(loading || loadingDelete) return;

		setLoading(true);
		
		apiStatus(id, status)
		.then(() => {
			NotificationManager.success("Status changed!", "Success");
			setTrigger(trigger => !trigger);
			setLoading(false);
		})
		.catch(() => {
			NotificationManager.error("Something went wrong during status change", "Error");
			setLoading(false);
		});
	}, [setTrigger, id, loading, loadingDelete]);

	const deleteThisOrder = useCallback(() => {

		if(loading || loadingDelete) return;

		setLoadingDelete(true);

		deleteOrder(id)
		.then(() => {
			NotificationManager.success("Order deleted!", "Success");
			setLoadingDelete(false);
			history.push('/dashboard');
		})
		.catch(() => {
			NotificationManager.error("Something went wrong during deleting order", "Error");
			setLoadingDelete(false);
		})

	}, [loading, loadingDelete, setLoadingDelete, id, setTrigger]);

	return (
		<div className="order">
			<div className="order__wrap">
				<b> 
				{
					order._id
				} 
				</b>
				<span>
				{
					order.firstName
				}
				</span>
				<span>
				{
					order.lastName
				}
				</span>
				<span>
				{
					order.adress
				}
				&nbsp;
				{
					order.postalCode
				}
				&nbsp;
				{
					order.city
				}
				</span>
				<span>
				{
					order.phone
				}
				</span>
				<span>
				{
					order.status
				}
				</span>
				<div className="order__tableWrap">
					<table>
						<thead>
							<tr>
								<th className="order__tableHead"> Title </th>
								<th className="order__tableHead"> Quantity </th>
							</tr>
						</thead>
						<tbody>
						{
							order.products ?
							order.products.map((product) => 
								<tr>
									<td className="order__tableField">
									{
										product.product.name
									}
									</td>
									<td className="order__tableField">
									{
										product.number
									}
									</td>
								</tr>
							) :
							""
						}
						</tbody>
					</table>
				</div>
				<span className="order__price">
				{
					order.price + "€"
				}
				</span>
				<div>
					<button className={`order__button ${ order.status == "created" ? "order__button--disabled" : "" } `} onClick={() => changeStatus("created")} disabled={order.status == "created" ? true : false }>Created</button>
					<button className={`order__button ${ order.status == "waitingForPayment" ? "order__button--disabled" : "" } `} onClick={() => changeStatus("waitingForPayment")} disabled={order.status == "waitingForPayment" ? true : false }>WaitingForPayment</button>
					<button className={`order__button ${ order.status == "processing" ? "order__button--disabled" : "" } `} onClick={() => changeStatus("processing")} disabled={order.status == "processing" ? true : false }>Processing</button>
					<button className={`order__button ${ order.status == "shipped" ? "order__button--disabled" : "" } `} onClick={() => changeStatus("shipped")} disabled={order.status == "shipped" ? true : false }>Shipped</button>
					<button className={`order__button ${ order.status == "delivered" ? "order__button--disabled" : "" } `} onClick={() => changeStatus("delivered")} disabled={order.status == "delivered" ? true : false }>Delivered</button>
				</div>
				<button className="order__button order__button--delete" onClick={deleteThisOrder}>Delete order</button>
			</div>
		</div>
	);
}

export default Order;