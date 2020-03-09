import React, { useState, useCallback } from "react";

import { publish as apiPublish } from "../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./partial/withAuth";

import "./scss/ProductEditor.scss";

function ProductEditor(){

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState(null);

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

	return(

		<div className="product-editor">
			<div className="product-editor__panel">
				<form method="POST">
					<fieldset className="product-editor__fieldset" disabled = { disabled } >
						<input type="text" placeholder="Name" name="name" className="product-editor__field" value={ name } onChange = { onNameChange } required/>
						<textarea name="description" className="product-editor__field product-editor__field--textarea" placeholder="description" value={ description } onChange = { onDescriptionChange } required/>
						<input type="number" placeholder="Price" name="price" className="product-editor__field" value={ price } onChange = { onPriceChange } required />
						<input type="file" name="image" className="product-editor__field" onChange={ onImageChange } />
						<button type="submit" className="product-editor__button" onClick = { publish } >Submit</button>
					</fieldset>
				</form>
			</div>
		</div>

	);
}

export default withAuth(ProductEditor);