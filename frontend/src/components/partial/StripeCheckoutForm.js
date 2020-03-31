import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import CardSection from './CardSection';

import { OrderContext } from "./OrderContext";

import {updateOrderStatus as apiStatus} from "../../services/shop.api";

import "./scss/StripeCheckoutForm.scss";

export default function CheckoutForm({secret}) {
  const stripe = useStripe();
  const elements = useElements();

  const history = useHistory();

  const orderContext = useContext(OrderContext);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: orderContext.order.firstName + " " + orderContext.order.lastName
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
      NotificationManager.error("Couldn't process payment!", "Error");
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        apiStatus(orderContext.order._id, "processing")
        .then(() => {
          NotificationManager.success("Order completed", "Success");
        })
        .catch(() => {
          NotificationManager.error("Something went wrong during status update, please contact us", "Error");
        })
        history.push('/finish');
      }


    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe__form">
      <CardSection />
      <button disabled={!stripe} className="stripe__button">Confirm order</button>
    </form>
  );
}