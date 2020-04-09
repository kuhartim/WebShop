import React, {useState, useCallback, useEffect} from "react";
import {NotificationManager} from "react-notifications";

import {checkAnswer as apiAnswer} from "../../services/shop.api";

import "./scss/ForgotQuestionCheck.scss";

function ForgotQuestionCheck({setStep, question, email, setAnswer, answer}){

	const [disabled, setDisabled] = useState(false);

	const onAnswerChange = useCallback(({ target: { value } }) => setAnswer(value), [setAnswer]);

	const checkAnswer = useCallback(() => {

		if(answer.length < 1){
			NotificationManager.error("Field is empty", "Error");
			return;
		}

		setDisabled(true);

		apiAnswer(email, answer)
		.then(() => {
			NotificationManager.success("Correct", "Success");
			setDisabled(false);
			setStep(3);
		})
		.catch(() => {
			NotificationManager.error("Answer is incorrect", "Error");
			setDisabled(false);
		});

	}, [answer, email, setDisabled]);

	return(
		<div className="forgot-question-check">
				<fieldset className="forgot-question-check__fieldset" disabled={ disabled } >
					<h2>{ question }</h2>
					<textarea type="text" className="forgot-question-check__field forgot-question-check__field--textarea" name="answer" placeholder="Answer" value={ answer } onChange={ onAnswerChange } required/>
					<button type="submit" class="forgot-question-check__button" onClick={checkAnswer}>Next</button>
				</fieldset>
		</div>
	)
}

export default ForgotQuestionCheck;