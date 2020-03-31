import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";


import Layout from "./partial/Layout";
import Home from "./Home";
import Products from "./Products";
import Product from "./Product";
import About from "./About";
import Login from "./Login";
import Registration from "./Registration";
import ProductEditor from "./ProductEditor";
import Dashboard from "./Dashboard";
import Cart from "./Cart";
import Adress from "./Adress";
import Payment from "./Payment";
import Finish from "./Finish";
import Order from "./Order";

function App() {

	return (

		<BrowserRouter>
			<Layout>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/registration" component={Registration} />
					<Route exact path="/dashboard" component={Dashboard} />
					<Route exact path="/products/:product" component={Product} />
					<Route exact path="/products" component={Products} />
					<Route exact path="/about" component={About} />
					<Route exact path="/cart" component={Cart} />
					<Route exact path="/adress" component={Adress} />
					<Route exact path="/payment" component={Payment} />
					<Route exact path="/finish" component={Finish} />
					<Route exact path="/order/:order" component={Order} />
				</Switch>
			</Layout>
		</BrowserRouter>

	);
}

export default App;