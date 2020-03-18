import React, { useState, useCallback, useRef, useEffect, useContext } from "react";
import {Link, useHistoty} from "react-router-dom";

import { publish as apiPublish, listProducts, deleteAllProducts, deleteOneProduct, updateProduct as apiUpdate, findProduct } from "../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./partial/withAuth";


import "./scss/ProductEditor.scss";


function ProductEntry({id, title, description, price, setTrigger, isEdit, setName, setDescription, setPrice}){

	const deleteProduct = useCallback(() => {

		deleteOneProduct(id)
		.then(() => {
			NotificationManager.success("Product successfully deleted!", "Success");
			setTrigger(trigger => !trigger);
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete product", "Error");
		})

	}, [id, setTrigger]);

	const edit = useCallback(() => {
		isEdit.current = id;
		setName(title);
		setDescription(description);
		setPrice(price);
	}, [isEdit, id, setName, setDescription, setPrice, title, description, price]);


	return (
		<tr>
			<td>
				{title}
			</td>
			<td>
				{
					description.length > 15 ? description.substring(0, 15) + "..." : description
				}
			</td>
			<td>
				{price}€
			</td>
			<td className="product-entry__field">
				<button className={`product-entry__button ${isEdit.current ? "product-entry__button--disabled" : "product-entry__button--edit"}`} onClick={edit}>Edit</button>
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
	const isEdit = useRef("");
	const initialProductLoad = useRef(false);

	const [trigger, _setTrigger] = useState(false);
	const setTrigger = useCallback((value) => {
		initialProductLoad.current = false;
		_setTrigger(value);
	}, [initialProductLoad, _setTrigger]);

	const [disabled, setDisabled] = useState(false);

	const onNameChange = useCallback(({ target: {value} }) => setName(value), [setName]);
	const onDescriptionChange = useCallback(({ target: {value}}) => setDescription(value), [setDescription]);
	const onPriceChange = useCallback(({ target: {value}}) => setPrice(value), [setPrice]);
	const onImageChange = useCallback(({ target: {files}}) => setImage(files[0]), [setImage]);

	const publish = useCallback(e => {

		e.preventDefault();

		setDisabled(true);

		if(!isEdit.current){

			apiPublish(name, description, price, image)
			.then( () => {
				NotificationManager.success("Product added!", "Success");
				setDisabled(false);
				setPrice(0);
				setName("");
				setDescription("");
				setImage(null);
				setTrigger(trigger => !trigger);
			})
			.catch( () => {
				NotificationManager.error("Cannot add product", "Error");
				setDisabled(false);
				setPrice(0);
				setName("");
				setDescription("");
				setImage(null);
			});
		}
		else{

			apiUpdate(isEdit.current, name, description, price, image)
			.then( () => {
				NotificationManager.success("Product updated!", "Success");
				setDisabled(false);
				setImage(null);
				setTrigger(trigger => !trigger);
				cancleEdit();
			})
			.catch( () => {
				NotificationManager.error("Cannot update product", "Error");
				setDisabled(false);
				setImage(null);
				cancleEdit();
			});

		}

	}, [isEdit, setTrigger, setDisabled, setProducts, name, description, price, image, setImage, setDescription, setName, setPrice]);

	useEffect(() => {

		if((page >= totalPages.current && initialProductLoad.current) || loading) return;

		setLoading(true);

		listProducts(page)
			.then(({ data: { docs, page, totalPages: total} }) => {
				setProducts(docs);
				setLoading(false);
				totalPages.current = total;
				initialProductLoad.current = true;
			})
			.catch((err) => {
				console.error(err);
				NotificationManager.error("Couldn't load products", "Error");
				setLoading(false);
			});

	}, [page, setLoading, loading, totalPages, setProducts, trigger]);


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

	const cancleEdit = useCallback(() => {
		isEdit.current = "";
		setName("");
		setDescription("");
		setPrice(0);
	}, [isEdit, setName, setDescription, setPrice])

	return(
		<>
		<div className="product-editor">
				<form method="POST">
					<fieldset className="product-editor__fieldset" disabled = { disabled } >
						<span className="product-editor__title">{ isEdit.current ? "Edit Product" : "Add Product"}</span>
						<input type="text" placeholder="Name" name="name" className={`product-editor__field ${isEdit.current ? "product-editor__field--edit" : ""}`} value={ name } onChange = { onNameChange } required/>
						<textarea name="description" className={`product-editor__field product-editor__field--textarea ${isEdit.current ? "product-editor__field--edit" : ""}`} placeholder="description" value={ description } onChange = { onDescriptionChange } required/>
						<input type="number" placeholder="Price" name="price" className={`product-editor__field ${isEdit.current ? "product-editor__field--edit" : ""}`} value={ price } onChange = { onPriceChange } required />
						<input type="file" name="image" className="product-editor__field product-editor__field--file" onChange={ onImageChange } />
						<button type="submit" className={`product-editor__button ${isEdit.current ? "product-editor__button--edit" : ""}`} onClick = { publish }>{ isEdit.current ? "Edit" : "Add"}</button>
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
									products.map((product, i) => <ProductEntry key={product.id} {...product} setTrigger={setTrigger} isEdit={isEdit} setName={setName} setDescription={setDescription} setPrice={setPrice}/>)
								}	
								</tbody>
							</table>
						</div>
					<button className="product-editor__button" onClick={deleteAll}>Delete all</button>
				</div>
		</div>
		<div className="product-editor__actionButtons">
			<button className={`product-editor__cancleProduct ${isEdit.current ? "product-editor__cancleProduct--active" : ""}`} onClick={cancleEdit}>Cancle</button>
		</div>
		</>
	);
}

export default ProductEditor;