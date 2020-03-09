import React, { useState, useEffect } from "react";
import axios from "axios";

import Cookies from "js-cookie";

const backend = axios.create({ baseURL: "http://localhost:4000" });


export async function login(email, password){

		const { data: { token } } = await backend.post('/api/v1/user/token', { email, password }).catch(handleUnauthorized);	
		
		if(!token) throw Error("No Token");

		Cookies.set("Token", token, { expires: Date.now() + 2*60*60*1000, secure: process.env.NODE_ENV === "production"});

		backend.defaults.headers.common.Authorization = `Bearer ${ token }`;
}

export function recoverToken(){

	const token = Cookies.get("Token");
	if(!token) return false;
	backend.defaults.headers.common.Authorization = `Bearer ${ token }`;
	return true;
}

export function isLoggedIn() {
	return !!backend.defaults.headers.common.Authorization;
}

export function registration(email, password, passwordConfirm){

	return backend.post('/api/v1/user', { email, password, password_confirm: passwordConfirm }).catch(handleUnauthorized);
}

export function publish(name, description, price, image){

	const formData = new FormData();
	formData.append("name", name);
	formData.append("description", description);
	formData.append("price", price);
	formData.append("image", image);

	return backend.post('/api/v1/product', formData, { headers: {"content-type": "multipart/form-data" }}).catch(handleUnauthorized);
}

export function listProducts(page, perPage=20){
	return backend.get(`/api/v1/product?page=${page}&perPage=${perPage}`);
}

function handleUnauthorized(err){
	if(err.response && err.response.status === 403) throw false;
	throw err;
}

