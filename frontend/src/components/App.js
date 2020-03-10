import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";


import Layout from "./partial/Layout";
import Home from "./Home";
import Products from "./Products";
import Product from "./Product";
import Login from "./Login";
import Registration from "./Registration";
import ProductEditor from "./ProductEditor";
import Dashboard from "./Dashboard";
import Cart from "./Cart";

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
					<Route exact path="/producteditor" component={ProductEditor} />
					<Route exact path="/cart" component={Cart} />
				</Switch>
			</Layout>
		</BrowserRouter>

	);
}

export default App;