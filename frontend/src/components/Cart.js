import React, {useEffect, useState, useCallback} from "react";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';
import PropTypes from "prop-types";
import _ from "lodash";


import {listCart, updateCart, deleteCartProduct, emptyCart} from "../services/shop.api";
import withAuth from "./partial/withAuth";
import CartProgress from "./partial/CartProgress";

import "./scss/Cart.scss";

function CartEntry({number, cartId, product: { _id: id, name, price } = {}, setTrigger}){

	const [editButton, setEditButton] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [cartEdit, setCartEdit] = useState(false);

	const size = useWindowSize();

	const [numberValue, setNumberValue] = useState(number);

	const onNumberChange = useCallback(({target: {value}}) => setNumberValue(value), [setNumberValue])

	const deleteProduct = useCallback(() => {
		deleteCartProduct(cartId)
		.then(() => {
			NotificationManager.success("Successfully deleted!", "Success");
			setTrigger(trigger => !trigger);
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete product from cart!", "Error");
		})
	}, [cartId, setTrigger]);

	const editProduct = useCallback(()=> {

		setDisabled(false);

		if(cartEdit){
			updateCart(cartId, numberValue)
			.then(() => {
				NotificationManager.success("Successfully changed!", "Success");
				setDisabled(true);
			})
			.catch(() => {
				NotificationManager.error("Couldn't change number", "Error");
				setDisabled(true);
			})
		}

		setCartEdit(!cartEdit);


	}, [setDisabled, setCartEdit, cartEdit, cartId, numberValue]); //z callbackom ne deluje

	return (
		<tr className="cartEntry">
			<td className="cartEntry__field">
				{
					size.width < 650 ? name.substring(0,3) + "..." : (name.length > 15 ? name.substring(0, 15) + "..." : name)
				}
			</td>
			<td className="cartEntry__field">
				{
					size.width < 700 ? price : price + "€"
				}
			</td>
			<td className="cartEntry__quantity">
				<input className={`cartEntry__number ${disabled ? "" : "cartEntry__number--open"}`} disabled={disabled} value={numberValue} onChange={onNumberChange} />
			</td>
			<td className="cartEntry__buttons">
				<button className="cartEntry__button cartEntry__button--delete" onClick={deleteProduct} disabled={!disabled}>Del</button>
				<button className={`cartEntry__button cartEntry__editButton${cartEdit ? "--open" : ""}`} onClick={editProduct}>{cartEdit ? "Save" : "Edit"}</button>
			</td>
		</tr>
	);
}

CartEntry.propTypes = {
	number: PropTypes.number.isRequired,
	product: PropTypes.shape({
		name: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired
	}).isRequired

}


function Cart(){

	const [cart, setCart] = useState([]);
	const [trigger, setTrigger] = useState(false);

	const history = useHistory();

	const size = useWindowSize();

	useEffect(()=>{

		(async () => {
			try{
				const {data: products} = await listCart();
				setCart(products);
			}

			catch(err){
				console.error(err);
				NotificationManager.error("Cart couldn't load!", "Error");
			}
		})();


	}, [setCart, trigger]);

	const deleteAll = useCallback(() => {
		emptyCart()
		.then(() => {
			NotificationManager.success("Successfully deleted!", "Success");
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete products from cart!", "Error");
		});

		setCart([]);
	}, [])

	const next = useCallback(() => {
		console.log(cart);
		if(cart.length < 1){
			NotificationManager.error("Cart is empty!", "Error");
			return;
		}
		history.push('/adress');
	}, [history, cart])


	return(
		<div className="cart">
			<CartProgress />
			<h1>Cart</h1>
			<div className="cart__table">
			<table>
				<thead>
					<tr>
						<th className="cart__field">
						Product
						</th>
						<th className="cart__field">
						{
							size.width < 700 ? "€" : "Price"
						}
						</th>
						<th className="cart__field">
						{
							size.width < 400 ? "Q." : "Quantity"
						}
						</th>
						<th className="cart__field">

						</th>
					</tr>
				</thead>
				<tbody>
				{
					_.map(cart, ({ product, number, _id }) => <CartEntry key={_id} product={product} number={number} cartId={_id} setTrigger={setTrigger}/>)
				}
				</tbody>
			</table>
			<button className="cart__delete" onClick={deleteAll}>Delete all</button>
			</div>
			<button className="cart__adress" onClick={next}>Adress</button>
		</div>
	);
}


export default withAuth(Cart);


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
