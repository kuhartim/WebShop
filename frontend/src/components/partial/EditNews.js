import React, { useState, useCallback, useRef, useEffect } from "react";
import {Link, useHistoty} from "react-router-dom";

import _ from "lodash";

import "./scss/EditNews.scss";

import { readNews, deleteNews, deleteAllNews as apiDeleteAllNews } from "../../services/shop.api";
import {NotificationManager} from 'react-notifications';

import withAuth from "./withAuth";

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
			<td className="news-entry__field--button">
				<button className="news-entry__button news-entry__button--delete" onClick={deleteThisMail}>Delete</button>
			</td>
		</tr>
	);
}



function EditNews(){

	const [news, setNews] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);


	const [totalPages, setTotalPages] = useState(1);
	const lastLoadedPage = useRef(0);

	const [trigger, _setTrigger] = useState(false);
	const setTrigger = useCallback((value) => {
		lastLoadedPage.current = 0;
		_setTrigger(value);
	}, [lastLoadedPage, _setTrigger]);

	useEffect(() => {

		if((page > totalPages || page == lastLoadedPage.current) || loading) return;

		setLoading(true);

		readNews(page)
			.then(({data: {news, page, numberAll}}) => {
				setNews(news);
				setPage(page);
				setLoading(false);
				setTotalPages(numberAll);
				lastLoadedPage.current = page;
			})
			.catch(err => {
				const message = _.get(err, "response.data.message", "Couldn't load news");
				if(message == "Couldn't load news")
				NotificationManager.error(message, "Error");
			});
	}, [page, setNews, setPage, totalPages, setTotalPages, trigger]);
	

	const newsPrev = useCallback(() => {
		if(page-1 >= 0){
			setPage(page-1);
		}
	}, [setPage, page]);

	const newsNext = useCallback(() => {
		if(page+1 <= totalPages){
			setPage(page+1);
		}
	}, [setPage, page, totalPages]);

	const deleteAllNews = useCallback(() => {

		apiDeleteAllNews()
		.then(() => {
			setTrigger(trigger => !trigger);
			NotificationManager.success("All mails deleted", "Success");
		})
		.catch(() => {
			NotificationManager.error("Couldn't delete mails", "Error");
		});

	}, [setTrigger]);

	return(
			<div className="edit-news">
			<span className="edit-news__title">News</span>
					<div className="edit-news__tableWrap">
						<table className="edit-news__newsTable">
							<thead className="edit-news__newsTable--head">
								<tr>
									<th className="product-entry__field">
										Mail
									</th>
									<th className="product-entry__field">

									</th>
								</tr>
							</thead>
							<tbody className="edit-news__newsTable--body">
							{
								news.map((newsObject) => <NewsEntry key={newsObject._id} setTrigger={setTrigger} {...newsObject} />)
							}	
							</tbody>
						</table>
					</div>
				<div className="edit-news__buttons">
					<button className={`edit-news__button edit-news__prev-next ${page == 1 ? "edit-news__button--disabled" : ""}`} disabled={page === 1} onClick={newsPrev}>Prev</button>
					<button className="edit-news__button edit-news__del" onClick={deleteAllNews} >Delete all</button>
					<button className={`edit-news__button edit-news__prev-next ${page == totalPages ? "edit-news__button--disabled" : ""}`} disabled={page === totalPages} onClick={newsNext}>Next</button>
				</div>
			</div>
	);
}

export default withAuth(EditNews);
