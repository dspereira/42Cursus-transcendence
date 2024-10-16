import { redirect } from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";
import isValidUsername from "../utils/usernameValidationUtils.js";
import { render } from "../js/router.js";
import { getHtmlElm } from "../utils/getHtmlElmUtils.js";
import PageEmailSent from "../page-components/page-email-sent.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
form {
	position: relative;
}

.alert.alert-danger {
	--bs-alert-color: ${colors.primary_text};
    --bs-alert-bg: #FFBAAB;
    --bs-alert-border-color: #FFBAAB;
    --bs-alert-link-color: var(--bs-danger-text-emphasis);
}

.icon {
	position: absolute;
	margin-top: 3px;
	font-size: 28px;
	color: ${colors.second_text};
}

.right-icon {
	right: 0;
	margin-right: 10px;
}

.highlight-text {
	text-align: center;
	font-size: 32px;
	margin-top: 0px;
	color: ${colors.primary_text};
}

.left-icon {
	left: 0;
	margin-left: 10px;
}

.input-padding {
	padding-left: 55px;
}

div {
	margin-top: 15px;
}

.show {
	display: block;
}

.hide {
	display: none;
}

#email, #username, #password, #confirm-password {
	background-image: none;
}

h1 {
	color: ${colors.primary_text};
	text-align: center;
	margin-top: 30px;
	margin-bottom: 30px;
}

.btn-submit {
	width: 100%;
	margin-top: 30px;
	color: ${colors.primary_text};
	background-color: ${colors.btn_default};
}

.btn-submit:hover {
	background-color: ${colors.btn_default};
	color: ${colors.second_text};
}

.btn-signin {
	width: 100%;
	border: 2px solid ${colors.btn_default};
	color: ${colors.second_text};
}

.btn-signxin:hover {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.form-control,.form-control:focus, .form-control::placeholder {
	background-color: ${colors.main_card};
	color: ${colors.primary_text};
	background-image: none;
}

.form-control:focus::placeholder {
	color: ${colors.second_text};
}

.logo-img {
	width: 80%;
	height: auto;
	align-test: center;
	margin-top: 40px;
}

.logo-container {
	display: flex;
	width: 90%;
	justify-content: center;
}


.main-container {
	display: flex;
	align-items: center;
	width: 100%;
	flex-direction: column;
}

.second-container {
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 50%;
	min-width: 460px;
	max-width: 750px;
}

#signup-form {
	width: 100%;
}



input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active {
	-webkit-background-clip: text;
	-webkit-text-fill-color: #ffffff;
	transition: background-color 5000s ease-in-out 0s;
	box-shadow: inset 0 0 20px 20px #23232329;
}
.invalid{
	color: #D9534F;	
}

.valid {
	color: #5CB85C;
}

.bi-x-lg, .bi-check-lg {
	margin-right: 10px;
}

.password-validation-msg {
	margin: 0px;
	padding: 0px;
}
`;

const getHtml = function(data) {
	const html = `


		<div class="main-container">
			<div class="second-container">
				<div class="logo-container">
					<img src="/img/pong-1k.png" class="logo-img" alt="logo">
				</div>
				<div class="highlight-text">Sign up</div>
				<form id="signup-form">
					<div class="alert alert-danger hide" role="alert"></div>
					<div class="form-group">
						<i class="icon left-icon bi-envelope"></i>
						<input type="text" class="input-padding form-control form-control-lg" id="email" placeholder="Email" maxlength="254">
					</div>
					<div class="form-group">
						<i class="icon left-icon bi-person"></i>
						<input type="text" class="input-padding form-control form-control-lg" id="username" placeholder="Username" maxlength="15">
					</div>
					<div class="form-group">
						<i class="icon left-icon bi bi-key"></i>
						<i class="icon right-icon bi bi-eye-slash eye-icon"></i>
						<input type="password" class="input-padding form-control form-control-lg" id="password" placeholder="Password" maxlength="25">
			</div>
			<div class="password-msg hide">
				<div class="password-validation-msg invalid" id="length"><i class="bi bi-x-lg"></i>Between 8 and 25 characters</div>
				<div class="password-validation-msg valid" id="lower_character"><i class="bi bi-check-lg"></i>At least one lowercase character</div>
				<div class="password-validation-msg invalid" id="upper_character"><i class="bi bi-x-lg"></i>At least one uppercase character</div>
				<div class="password-validation-msg valid" id="digit"><i class="bi bi-check-lg"></i>At least one number</div>
				<div class="password-validation-msg invalid" id="special_character"><i class="bi bi-x-lg"></i>At least one special character (@, #, $, %, etc.)</div>
				<div class="password-validation-msg invalid hide" id="white_character"><i class="bi bi-x-lg"></i>Can't have white characters</div>
					</div>
					<div class="form-group">
						<i class="icon left-icon bi bi-key"></i>
						<i class="icon right-icon bi bi-eye-slash eye-icon"></i>
						<input type="password" class="input-padding form-control form-control-lg" id="confirm-password" placeholder="Confirm Password" maxlength="25">
					</div>
					<div>
						<button type="submit" class="btn btn-primary btn-submit">Sign Up</button>
					</div>
					<div>
						<button type="button" class="btn btn-outline-primary btn-signin">Already has an account? Sign in here</button>
					</div>
				</form>
			</div>
		</div>
	`;

	return html;
}

const password_requirements = {
	length: password => password.length >= 8 && password.length <= 25,
	lower_character: password => /[a-z]/.test(password),
	upper_character: password => /[A-Z]/.test(password),
	special_character: password => /[!@#$%^&*(),.?":{}|<>]/.test(password),
	digit: password => /[0-9]/.test(password),
	white_character: password => !/\s/.test(password)
}

export default class SignupForm extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.#initComponent();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);

		this.submitBtn = this.html.querySelector(".btn-submit");
		this.passwordInp = this.html.querySelector("#password");
		this.passwordMsg = this.html.querySelector(".password-msg");
		this.passValidationsElms = this.#getValidationMenssagesObj();
	}

	#scripts() {
		this.#showHidePassword();
		this.#submit();
		this.#redirectToSignInForm();
		this.#passwordInputEvents();
	}

	#showHidePassword() {
		let eyes = this.html.querySelectorAll(".eye-icon");
		eyes.forEach(eye => {
			eye.addEventListener("click", () => {
				const openEye = "bi-eye";
				const closeEye = "bi-eye-slash";
				eye.classList.toggle(openEye);
				eye.classList.toggle(closeEye);
				const input = eye.parentElement.querySelector("input");
				input.type = input.type === "password" ? "text" : "password";
			});
		})
	}

	#getdInputData() {
		const data = {
			email: this.html.querySelector('#email').value.trim(),
			username: this.html.querySelector('#username').value.trim(),
			password: this.html.querySelector('#password').value.trim(),
			confirmPassword: this.html.querySelector("#confirm-password").value.trim()
		}
		return data;
	}

	#isValidEmail(email) {
		const idxLastDot = email.lastIndexOf('.');
		const idxLastAtSign = email.lastIndexOf('@');
		const idxFisrtAtSign = email.indexOf('@');

		if (idxFisrtAtSign < 0 || idxLastAtSign < 0 || idxLastDot < 0)
			return false;
		if (idxLastAtSign != idxFisrtAtSign)
			return false;
		if (idxLastAtSign > idxLastDot)
			return false;
		return true;
	}

	#getInvalidFields(data) {
		const invalidFilds = {};
	
		for (const [key, value] of Object.entries(data)) {
			if (!value)
				invalidFilds[key] = "empty";
			else if (key === "email" && !this.#isValidEmail(value))
				invalidFilds.email = "invalid";
			else if (key === "username" && !isValidUsername(value))
				invalidFilds.username = "invalid";
			else if (!this.#validatePassword())
				invalidFilds.password = "invalid";
		}
		if (!invalidFilds.password && !invalidFilds.confirmPassword) {
			if (data.password !== data.confirmPassword) {
				invalidFilds.password = "unmatch";
				invalidFilds.confirmPassword = "unmatch";
			}	
		}
		return invalidFilds;
	}

	#redirectToSignInForm() {
		const btn = this.html.querySelector(".btn-signin");
		btn.addEventListener("click", (event) => {
			redirect("/login");
		});
	}

	#submit() {
		const signupForm = this.html.querySelector("#signup-form");
		signupForm.addEventListener("submit", (event) => {
			event.preventDefault();
			this.submitBtn.disabled = true;
			const dataForm = this.#getdInputData();
			const invalidFilds = this.#getInvalidFields(dataForm);
			this.#removeAllInvalidStyles();
			if (Object.keys(invalidFilds).length) {
				this.#setAllFormErrors(invalidFilds);
				this.submitBtn.disabled = false;
			}
			else
				callAPI("POST", "/auth/register", dataForm, this.#apiResHandlerCalback);
		});
	}

	#apiResHandlerCalback = (res, data) => {
		if (res.ok && data.message === "success")
			render(getHtmlElm(PageEmailSent));
		else {
			this.#handleApiFormErrors(res.status, data.message);
			this.submitBtn.disabled = false;
			if (data.hasOwnProperty("requirements")) {
				let key, value;
				for (key in data.requirements) {
					value = data.requirements[key];
					this.#updatePasswordValidations(this.passValidationsElms[key], value);
				}
			}
		}
	}

	#updatePasswordValidations(elm, isValid) {
		const icon = elm.querySelector("i");

		elm.classList.remove("valid");
		elm.classList.remove("invalid");
		icon.classList.remove("bi-x-lg");
		icon.classList.remove("bi-check-lg");
		if (!isValid) {
			elm.classList.add("invalid");
			icon.classList.add("bi-x-lg");
			if (elm.id == "white_character")
				elm.classList.remove("hide");
		}
		else {
			elm.classList.add("valid");
			icon.classList.add("bi-check-lg");
			if (elm.id == "white_character")
				elm.classList.add("hide");
		}
	}

	#getValidationMenssagesObj() {
		const obj = {};
		const elms = this.html.querySelectorAll(".password-validation-msg");
		elms.forEach((elm) => {
			obj[elm.id] = elm;
		});
		return obj;
	}

	#setInvalidInputStyle(inputId) {
		if (inputId === "confirmPassword")
			inputId = "confirm-password";
		this.html.querySelector(`#${inputId}`).classList.add("is-invalid");
	}

	#removeAllInvalidInputsStyle() {
		const inputs = this.html.querySelectorAll('input');
		inputs.forEach(input => {
			input.classList.remove("is-invalid");
		})
	}

	#removeAlertMessage() {
		const alert = this.html.querySelector(".alert");
		alert.classList.remove("show");
		alert.classList.add("hide");
		alert.textContent = "";	
	}

	#removeAllInvalidStyles() {
		this.#removeAllInvalidInputsStyle();
		this.#removeAlertMessage();
	}

	#showAlertMessage(message) {
		const alert = this.html.querySelector(".alert");
		alert.classList.remove("hide");
		alert.classList.add("show");
		if (message)
			alert.textContent = message;
	}

	#updateAlertMessage(message) {
		const alert = this.html.querySelector(".alert");
		const msg = alert.textContent;
		if (!msg)
			alert.textContent = message;
		else
			alert.textContent = `${msg} / ${message}`;
	}

	#setAllFormErrors(invalidFilds) {
		let emptyFilds = false;

		this.#showAlertMessage();
		for (const [key, value] of Object.entries(invalidFilds)) {
			this.#setInvalidInputStyle(key);
			if (key == "email" && value == "invalid")
				this.#updateAlertMessage("Invalid email");
			else if (key == "username" && value == "invalid")
				this.#updateAlertMessage("Invalid username");
			else if (key == "password" && value == "invalid")
				this.#updateAlertMessage("Invalid password");
			else if (key == "password" && value == "unmatch")
				this.#updateAlertMessage("Unmatched passwords");
			else if (value == "empty")
				emptyFilds = true;
		}
		if (emptyFilds)
			this.#updateAlertMessage("Required fields");
	}

	#handleApiFormErrors(status, message) {
		if (status == 400)
			this.#showAlertMessage("Invalid Form");
		if (status == 409) {
			this.#showAlertMessage(message);
			if (message.indexOf("Username") > -1)
				this.#setInvalidInputStyle("username");
			else if (message.indexOf("Email") > -1)
				this.#setInvalidInputStyle("email");
			else if (message.indexOf("Password") > -1)
				this.#setInvalidInputStyle("password");
		} 
	}

	#passwordInputEvents() {
		this.passwordInp.addEventListener("input", () => {
			if (this.passwordInp.value.length) {
				this.passwordMsg.classList.remove("hide");
				if (this.#validatePassword(this.passwordInp.value))
					this.passwordMsg.classList.add("hide");	
			}
			else
				this.passwordMsg.classList.add("hide");
		});
	}

	#validatePassword(password) {
		let pass = password;
		if (!password)
			pass = this.passwordInp.value;
			
		let isValid = true;
		for (let key in password_requirements) {
			this.#updatePasswordValidations(this.passValidationsElms[key], password_requirements[key](pass));
			if (!password_requirements[key](pass))
				isValid = false;
		}
		return isValid;
	}
}

customElements.define("signup-form", SignupForm);
