import React, { useEffect, useState, useRef, useCallback } from "react";

import { listProducts } from "../services/shop.api";

import {NotificationManager} from 'react-notifications';

import useWindowSize from "./partial/useWindowSize";

import ProductPanel from "./partial/ProductPanel"
import "./scss/Products.scss";

function Products() {

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const [totalPages, setTotalPages] = useState(1);
	const lastLoadedPage = useRef(0);
	const initialProductLoad = useRef(false);

	useEffect(() => {

		if((page > totalPages || page == lastLoadedPage.current) || loading) return;

		setLoading(true);

		listProducts(page, 12)
			.then(({ data: { docs, page, totalPages: total} }) => {
				setProducts(docs);
				setLoading(false);
				lastLoadedPage.current = page;
				setTotalPages(total);
				initialProductLoad.current = true;
			})
			.catch((err) => {
				console.error(err);
				NotificationManager.error("Couldn't load products", "Error");
				setLoading(false);
			});

	}, [page, setLoading, loading, totalPages, setProducts, products]);

	const productsPrev = useCallback(() => {
		if(page-1 >= 0){
			setPage(page-1);
		}
	}, [setPage, page]);

	const productsNext = useCallback(() => {
		if(page+1 <= totalPages){
			setPage(page+1);
		}
	}, [setPage, page, totalPages]);

	return (

		<div className="products">
			<h2 className="products__title" > Our Products </h2>
			<div className="products__list">
				{
					products.map((product, i) => <ProductPanel key={i} {...product} />)
				}
			</div>
			<div className="products__buttons">
				<button className="products__button products__button--prev" onClick={productsPrev} >Prev</button>
				<div className="products__page">
				{
					page
				}
				</div>
				<button className="products__button products__button--next" onClick={productsNext} >Next</button>
			</div>
		</div>

	);
}

export default Products;