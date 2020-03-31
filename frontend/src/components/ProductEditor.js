import React, { useState, useCallback, useRef, useEffect, useContext } from "react";
import {Link, useHistoty} from "react-router-dom";

import { publish as apiPublish, listProducts, deleteAllProducts, deleteOneProduct, updateProduct as apiUpdate, findProduct, allOrders, readNews, deleteNews } from "../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./partial/withAuth";


import "./scss/ProductEditor.scss";

function NewsEntry({_id, email, setTrigger}){

	const [loading, setLoading] = useState(false);

	const deleteThisMail = useCallback(() => {

		if(loading) return;

		setLoading(true);

		deleteNews(_id)
		.then(() => {
			NotificationManager.success("Successfully deleted!", "Success");
			setLoading(false);
			setTrigger(trigger => !trigger);
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete this mail!", "Error");
			setLoading(false);
		})

	}, [setLoading, loading, _id, setTrigger]);

	return (
		<tr>
			<td className="news-entry__field">
				{
					email.length > 30 ? email.substring(0, 30) + "..." : email
				}
			</td>
			<td>
				<button className="product-entry__button product-entry__button--delete" onClick={deleteThisMail}>Delete</button>
			</td>
		</tr>
	);
}

function OrderEntry({_id, firstName, lastName, adress, paymentMethod,status}){

	const size = useWindowSize();

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
			<td className="order-entry__field" hidden={size.width < 570 ? true : false}>
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
				{title}
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

function ProductEditor(){

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState(null);

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const [orders, setOrders] = useState([]);
	const [loadingOrders, setLoadingOrders] = useState(false);

	const [news, setNews] = useState([]);
	const [loadingNews, setLoadingNews] = useState(false);

	const totalPages = useRef(1);
	const isEdit = useRef("");
	const initialProductLoad = useRef(false);

	const [trigger, _setTrigger] = useState(false);
	const setTrigger = useCallback((value) => {
		initialProductLoad.current = false;
		_setTrigger(value);
	}, [initialProductLoad, _setTrigger]);

	const [disabled, setDisabled] = useState(false);

	const size = useWindowSize();

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

		if(loadingOrders) return;

		setLoadingOrders(true);

		allOrders()
			.then(({data}) => {
				setOrders(data);
				setLoadingOrders(false);
			})
			.catch((err) => {
				console.error(err);
				NotificationManager.error("Couldn't load orders", "Error");
				setLoadingOrders(false);
			});

		if(loadingNews) return;

		setLoadingNews(true);

		readNews()
			.then(({data}) => {
				setNews(data);
				setLoadingNews(false);
			})
			.catch((err) => {
				console.error(err);
				NotificationManager.error("Couldn't load news", "Error");
				setLoadingNews(false);
			});

	}, [page, setLoading, loading, totalPages, setProducts, trigger, loadingOrders, setLoadingOrders, orders, setOrders]);


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

	console.log(window.width);

	return(
		<>
		<div className="product-editor__actionButtons">
			<button className={`product-editor__cancleProduct ${isEdit.current ? "product-editor__cancleProduct--active" : ""}`} onClick={cancleEdit}>Cancle</button>
		</div>
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
								<tbody className="product-editor__productTable--body">
								{
									products.map((product) => <ProductEntry key={product.id} {...product} setTrigger={setTrigger} isEdit={isEdit} setName={setName} setDescription={setDescription} setPrice={setPrice}/>)
								}	
								</tbody>
							</table>
						</div>
					<button className="product-editor__button" onClick={deleteAll}>Delete all</button>
				</div>
				<div className="product-editor__orders">
				<span className="product-editor__title">Orders</span>
						<div className="product-editor__tableWrap">
							<table className="product-editor__orderTable">
								<thead className="product-editor__orderTable--head">
									<tr>
										<th className="product-entry__field">
											First name
										</th>
										<th className="product-entry__field">
											Last name
										</th>
										<th className="product-entry__field" hidden={size.width < 570 ? true : false}>
											Adress
										</th>
										<th className="product-entry__field">
											Payment method
										</th>
										<th className="product-entry__field">
											Status
										</th>
										<th className="product-entry__field">

										</th>
									</tr>
								</thead>
								<tbody className="product-editor__orderTable--body">
								{
									orders.map((order) => <OrderEntry key={order._id} {...order} />)
								}	
								</tbody>
							</table>
						</div>
				</div>
				<div className="product-editor__news">
				<span className="product-editor__title">Orders</span>
						<div className="product-editor__tableWrap">
							<table className="product-editor__newsTable">
								<thead className="product-editor__newsTable--head">
									<tr>
										<th className="product-entry__field">
											Mail
										</th>
										<th className="product-entry__field">

										</th>
									</tr>
								</thead>
								<tbody className="product-editor__newsTable--body">
								{
									news.map((newsObject) => <NewsEntry key={news._id} setTrigger={setTrigger} {...newsObject} />)
								}	
								</tbody>
							</table>
						</div>
					<button className="product-editor__button" >Delete all</button>
				</div>
		</div>
		</>
	);
}

function useWindowSize() {

  const isClient = typeof window === 'object';



  function getSize() {

    return {

      width: isClient ? window.innerWidth : undefined,

      height: isClient ? window.innerHeight : undefined

    };

  }



  const [windowSize, setWindowSize] = useState(getSize);



  useEffect(() => {

    if (!isClient) {

      return false;

    }

    

    function handleResize() {

      setWindowSize(getSize());

    }



    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []); // Empty array ensures that effect is only run on mount and unmount



  return windowSize;

}

export default ProductEditor;