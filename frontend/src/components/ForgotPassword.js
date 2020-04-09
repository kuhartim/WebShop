import React, {useState, useCallback} from "react";

import ForgotEmailCheck from "./partial/ForgotEmailCheck";
import ForgotQuestionCheck from "./partial/ForgotQuestionCheck";
import ChangePassword from "./partial/ChangePassword";

import "./scss/ForgotPassword.scss";


function ForgotPassword(){

	const [email, setEmail] = useState("");
	const [step, setStep] = useState(1);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");

	return(
		<div className="forgot-password">
			<div className="forgot-password__wrap">
			<span className="forgot-email-check__text">Forgot Password</span>
			{
				step == 1 ?
				<ForgotEmailCheck setStep={setStep} setQuestion={setQuestion} setEmail={setEmail} email={email} />
				:
				step == 2 ?
				<ForgotQuestionCheck setStep={setStep} question={question} email={email} setAnswer={setAnswer} answer={answer} />
				: 
				<ChangePassword email={email} answer={answer} />
			}
			</div>
		</div>
	)
}

export default ForgotPassword;