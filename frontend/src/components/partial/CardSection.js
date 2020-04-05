import React, {useState, useEffect} from 'react';
import {CardElement} from '@stripe/react-stripe-js';
import './scss/CardSectionStyles.scss'

function CardSection() {


  const size = useWindowSize();

  const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: size.width < 400 ? "13px" : "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

  return (
    <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  );
};

export default CardSection;


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