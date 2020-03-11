import React, { useState, useCallback, useRef, useEffect } from "react";

import { publish as apiPublish, listProducts, deleteAllProducts, deleteOneProduct } from "../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./partial/withAuth";


import "./scss/ProductEditor.scss";

function ProductEntry({id, title, description, price}){

	const deleteProduct = useCallback(() => {

		deleteOneProduct(id)
		.then(() => {
			NotificationManager.success("Product successfully deleted!", "Success");
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete product", "Error");
		})

	}, [id]);

	return (
		<tr>
			<td>
				{title}
			</td>
			<td>
				{description}
			</td>
			<td>
				{price}€
			</td>
			<td className="product-entry__field">
				<button className="product-entry__button product-entry__button--edit">Edit</button>
				<button className="product-entry__button product-entry__button--delete" onClick={deleteProduct}>Delete</button>
			</td>
		</tr>
	);
}

function ProductEditor(){

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState(null);

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const totalPages = useRef(1);

	const [disabled, setDisabled] = useState(false);

	const onNameChange = useCallback(({ target: {value} }) => setName(value), [setName]);
	const onDescriptionChange = useCallback(({ target: {value}}) => setDescription(value), [setDescription]);
	const onPriceChange = useCallback(({ target: {value}}) => setPrice(value), [setPrice]);
	const onImageChange = useCallback(({ target: {files}}) => setImage(files[0]), [setImage]);

	const publish = useCallback(e => {
		e.preventDefault();

		setDisabled(true);

		apiPublish(name, description, price, image)
		.then( () => {
			NotificationManager.success("Product added!", "Success");
			setDisabled(false);
		})
		.catch( () => {
			NotificationManager.error("Cannot add product", "Error");
			setDisabled(false);
		});

	}, [setDisabled, name, description, price, image]);

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


	const deleteAll = useCallback(() => {

		deleteAllProducts()
		.then(() => {
			setProducts([]);
			NotificationManager.success("All products were deleted!", "Success");
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete products", "Error");
		});

	}, [setProducts]);

	return(

		<div className="product-editor">
				<form method="POST">
					<fieldset className="product-editor__fieldset" disabled = { disabled } >
						<span className="product-editor__title">Add Product</span>
						<input type="text" placeholder="Name" name="name" className="product-editor__field" value={ name } onChange = { onNameChange } required/>
						<textarea name="description" className="product-editor__field product-editor__field--textarea" placeholder="description" value={ description } onChange = { onDescriptionChange } required/>
						<input type="number" placeholder="Price" name="price" className="product-editor__field" value={ price } onChange = { onPriceChange } required />
						<input type="file" name="image" className="product-editor__field product-editor__field--file" onChange={ onImageChange } />
						<button type="submit" className="product-editor__button" onClick = { publish } >Submit</button>
					</fieldset>
				</form>
				<div className="product-editor__products">
					<span className="product-editor__title">Edit/Delete Product</span>
						<div className="product-editor__tableWrap">
							<table className="product-editor__productTable">
								<thead className="product-editor__productTable--head">
									<tr>
										<th>
											Product
										</th>
										<th>
											description
										</th>
										<th>
											Price
										</th>
										<th>
											
										</th>
									</tr>
								</thead>
								<tbody className="product-editor__productTable--body">
								{
									products.map((product, i) => <ProductEntry key={i} {...product} />)
								}	
								</tbody>
							</table>
						</div>
					<button className="product-editor__button" onClick={deleteAll}>Delete all</button>
				</div>
		</div>

	);
}

export default withAuth(ProductEditor);