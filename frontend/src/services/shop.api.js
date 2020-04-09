import React from "react";
import axios from "axios";

import Cookies from "js-cookie";

const backend = axios.create({ baseURL: "http://localhost:4000" });


export async function login(email, password){

		const { data: { token } } = await backend.post('/api/v1/user/token', { email, password }).catch(handleUnauthorized);	
		
		if(!token) throw Error("No Token");

		Cookies.set("Token", token, { expires: Date.now() + 2*60*60*1000, secure: process.env.NODE_ENV === "production"});

		backend.defaults.headers.common.Authorization = `Bearer ${ token }`;
}

export function logout(){
	Cookies.remove("Token");
	return backend.delete('/api/v1/user/token').catch(handleUnauthorized);
}

export function isAdmin(){
	return backend.post('/api/v1/user/admin').catch(handleUnauthorized);
}

export function getUser(){
	return backend.post('/api/v1/user/user').catch(handleUnauthorized);
}

export function userExist(email){
	return backend.post('/api/v1/user/exist', { email }).catch(handleUnauthorized);
}

export function checkAnswer(email, answer){
	return backend.post('/api/v1/user/question', { email, answer }).catch(handleUnauthorized);
}

export function changePassword(email, answer, password){
	return backend.post('/api/v1/user/changePassword', {email, answer, password}).catch(handleUnauthorized);
}

export function getAllUsers(page, perPage=10){
	return backend.get(`/api/v1/user?page=${page}&perPage=${perPage}`).catch(handleUnauthorized);
}

export function deleteUser(id){
	return backend.delete(`/api/v1/user/${id}`).catch(handleUnauthorized);
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

export function registration(email, password, passwordConfirm, question, answer){

	return backend.post('/api/v1/user', { email, password, password_confirm: passwordConfirm, question, answer }).catch(handleUnauthorized);
}

export function publish(name, description, price, image){

	const formData = new FormData();
	formData.append("name", name);
	formData.append("description", description);
	formData.append("price", price);
	formData.append("image", image);

	return backend.post('/api/v1/product', formData, { headers: {"content-type": "multipart/form-data" }}).catch(handleUnauthorized);
}

export function updateProduct(id, name, description, price, image){

	const formData = new FormData();
	formData.append("name", name);
	formData.append("description", description);
	formData.append("price", price);
	formData.append("image", image);

	return backend.post(`/api/v1/product/${id}`, formData, { headers: {"content-type": "multipart/form-data" }}).catch(handleUnauthorized);

}

export function listProducts(page, perPage=10){
	return backend.get(`/api/v1/product?page=${page}&perPage=${perPage}`).catch(handleUnauthorized);
}

export function findProduct(id){
	return backend.get(`/api/v1/product/${id}`).catch(handleUnauthorized);
}

export function deleteOneProduct(id){
	return backend.delete(`/api/v1/product/${id}`).catch(handleUnauthorized);
}

export function deleteAllProducts(){
	return backend.delete('/api/v1/product/').catch(handleUnauthorized);
}

export function listCart(){
	return backend.get('/api/v1/cart').catch(handleUnauthorized);
}

export function addToCart(product, number){
	return backend.post('/api/v1/cart', {product, number}).catch(handleUnauthorized);
}

export function updateCart(id, number){
	return backend.post(`/api/v1/cart/${id}`, {number}).catch(handleUnauthorized);
}

export function deleteCartProduct(id){
	return backend.delete(`/api/v1/cart/${id}`).catch(handleUnauthorized);
}

export function deleteCart(){
	return backend.delete('/api/v1/cart').catch(handleUnauthorized);
}

export function emptyCart(){
	return backend.delete('/api/v1/cart').catch(handleUnauthorized);
}

export function newOrder(firstName, lastName, adress, postalCode, city, phone){
	return backend.post('/api/v1/order', {firstName, lastName, adress, postalCode, city, phone}).catch(handleUnauthorized);
}

export function updateOrder(id, paymentMethod){
	return backend.post(`/api/v1/order/${id}`, {paymentMethod}).catch(handleUnauthorized);
}

export function updateOrderStatus(id, status){
	return backend.post(`/api/v1/order/status/${id}`, {status}).catch(handleUnauthorized);
}

export function readOrder(status){
	return backend.get(`/api/v1/order?status=${status}`).catch(handleUnauthorized);
}

export function readOrderById(id){
	return backend.get(`/api/v1/order/order/${id}`).catch(handleUnauthorized);
}

export function allOrders(page, perPage=10){
	return backend.get(`/api/v1/order/all?page=${page}&perPage=${perPage}`).catch(handleUnauthorized);
}

export function readUserOrders(page, perPage=10){
	return backend.get(`api/v1/order/user?page=${page}&perPage=${perPage}`).catch(handleUnauthorized);
}

export function deleteOrder(id){
	return backend.delete(`/api/v1/order/${id}`).catch(handleUnauthorized);
}

export function signUpToNews(email){
	return backend.post('/api/v1/news', {email}).catch(handleUnauthorized);
}

export function newsMailCheck(email){
	return backend.post('/api/v1/news/check', {email}).catch(handleUnauthorized);
}

export function readNews(page, perPage=10){
	return backend.get(`/api/v1/news?page=${page}&perPage=${perPage}`).catch(handleUnauthorized);
}

export function deleteNews(id){
	return backend.delete(`/api/v1/news/${id}`).catch(handleUnauthorized);
}

export function deleteAllNews(){
	return backend.delete('/api/v1/news').catch(handleUnauthorized);
}

function handleUnauthorized(err){
	if(err.response && err.response.status === 403) throw false;
	throw err;
}

