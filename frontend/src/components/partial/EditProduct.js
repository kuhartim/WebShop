import React, { useState, useCallback, useRef, useEffect} from "react";
import {Link, useHistoty} from "react-router-dom";

import { publish as apiPublish, listProducts, deleteAllProducts, deleteOneProduct, updateProduct as apiUpdate, findProduct} from "../../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./withAuth";


import "./scss/EditProduct.scss";


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
			<td className="product-entry__field">
				{
					title.length > 20 ? title.substring(0, 20) + "..." : title
				}
			</td>
			<td className="product-entry__field">
				{
					description.length > 15 ? description.substring(0, 15) + "..." : description
				}
			</td>
			<td className="product-entry__field">
				{price}€
			</td>
			<td className="product-entry__fieldButton">
				<button className={`product-entry__button ${isEdit.current ? "product-entry__button--disabled" : "product-entry__button--edit"}`} onClick={edit}>Edit</button>
				<button className="product-entry__button product-entry__button--delete" onClick={deleteProduct}>Delete</button>
			</td>
		</tr>
	);
}

function EditProduct(){

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState(null);

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const [totalPages, setTotalPages] = useState(1);
	const isEdit = useRef("");
	const lastLoadedPage = useRef(0);

	const [trigger, _setTrigger] = useState(false);
	const setTrigger = useCallback((value) => {
		lastLoadedPage.current = 0;
		_setTrigger(value);
	}, [lastLoadedPage, _setTrigger]);

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

		if((page > totalPages || page == lastLoadedPage.current) || loading) return;

		setLoading(true);

		listProducts(page)
			.then(({ data: { docs, page, totalPages: total} }) => {
				setTotalPages(total);
				lastLoadedPage.current = page;
				setProducts(docs);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				NotificationManager.error("Couldn't load products", "Error");
				setLoading(false);
			});

	}, [page, setLoading, loading, totalPages, setTotalPages, lastLoadedPage, setProducts, trigger]);
	
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
		<div className="edit-products">
			<div className="edit-products__actionButtons">
				<button className={`edit-products__cancleProduct ${isEdit.current ? "edit-products__cancleProduct--active" : ""}`} onClick={cancleEdit}>Cancle</button>
			</div>
				<form method="POST">
					<fieldset className="edit-products__add" disabled = { disabled } >
						<span className="edit-products__title">{ isEdit.current ? "Edit Product" : "Add Product"}</span>
						<input type="text" placeholder="Name" name="name" className={`edit-products__field ${isEdit.current ? "edit-products__field--edit" : ""}`} value={ name } onChange = { onNameChange } required/>
						<textarea name="description" className={`edit-products__field edit-products__field--textarea ${isEdit.current ? "edit-products__field--edit" : ""}`} placeholder="description" value={ description } onChange = { onDescriptionChange } required/>
						<input type="number" placeholder="Price" name="price" className={`edit-products__field ${isEdit.current ? "edit-products__field--edit" : ""}`} value={ price } onChange = { onPriceChange } required />
						<input type="file" name="image" className="edit-products__field edit-products__field--file" onChange={ onImageChange } />
						<button type="submit" className={`edit-products__button edit-products__button--add ${isEdit.current ? "edit-products__button--edit" : ""}`} onClick = { publish }>{ isEdit.current ? "Edit" : "Add"}</button>
					</fieldset>
				</form>
				<div className="edit-products__products">
					<span className="edit-products__title">Edit/Delete Product</span>
						<div className="edit-products__tableWrap">
							<table className="edit-products__productTable">
								<thead className="edit-products__productTable--head">
									<tr>
										<th className="product-entry__field">
											Product
										</th>
										<th className="product-entry__field">
											description
										</th>
										<th className="product-entry__field">
											Price
										</th>
										<th className="product-entry__field">
											
										</th>
									</tr>
								</thead>
								<tbody className="edit-products__productTable--body">
								{
									products.map((product) => <ProductEntry key={product.id} {...product} setTrigger={setTrigger} isEdit={isEdit} setName={setName} setDescription={setDescription} setPrice={setPrice}/>)
								}	
								</tbody>
							</table>
						</div>
						<div className="edit-products__buttons">
							<button className={`edit-products__button edit-products__prev-next ${page == 1 ? "edit-products__button--disabled" : ""}`} disabled={page === 1} onClick={productsPrev}>Prev</button>
							<button className="edit-products__button edit-products__del" onClick={deleteAll} >Delete all</button>
							<button className={`edit-products__button edit-products__prev-next ${page == totalPages ? "edit-products__button--disabled" : ""}`} disabled={page === totalPages} onClick={productsNext}>Next</button>
						</div>
				</div>	
		</div>
	);
}

export default withAuth(EditProduct);