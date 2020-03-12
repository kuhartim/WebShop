import React, { useEffect, useState, useRef } from "react";

import { listProducts } from "../services/shop.api";

import {NotificationManager} from 'react-notifications';

import ProductPanel from "./partial/ProductPanel"
import "./scss/Products.scss";

function Products() {

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const totalPages = useRef(1);

	useEffect(() => {

		if(page > totalPages.current || loading) return;

		setLoading(true);

		listProducts(page)
			.then(({ data: { docs, page, totalPages: total} }) => {
				setProducts(products.concat(docs));
				setLoading(false);
				totalPages.current = total;
			})
			.catch((err) => {
				console.error(err);
				NotificationManager.error("Couldn't load products", "Error");
				setLoading(false);
			});

	}, [page, setLoading, totalPages, setProducts, products]);

	return (

		<div className="products">
			<div className="products__list">
				{
					products.map((product, i) => <ProductPanel key={i} {...product} />)
				}
			</div>
		</div>

	);
}

export default Products;