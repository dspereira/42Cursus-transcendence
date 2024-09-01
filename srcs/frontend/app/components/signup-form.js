import {redirect} from "../js/router.js";
import {callAPI} from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";

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
	background-color: ${colors.button_hover};
}

.btn-submit:hover {
	background-color: ${colors.button_hover};
	color: ${colors.second_text};
}

.btn-signin {
	width: 100%;
	border: 2px solid ${colors.button_hover};
	color: ${colors.second_text};
}

.btn-signxin:hover {
	background-color: ${colors.button_hover};
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

`;

const getHtml = function(data) {
	const html = `
		<h1>Sign up</h1>
		<form id="signup-form">
			<div class="alert alert-danger hide" role="alert"></div>
			<div class="form-group">
				<i class="icon left-icon bi-envelope"></i>
				<input type="text" class="input-padding form-control form-control-lg" id="email" placeholder="Email" maxlength="100">
			</div>
			<div class="form-group">
				<i class="icon left-icon bi-person"></i>
				<input type="text" class="input-padding form-control form-control-lg" id="username" placeholder="Username" maxlength="30">
			</div>
			<div class="form-group">
				<i class="icon left-icon bi bi-key"></i>
				<i class="icon right-icon bi bi-eye-slash eye-icon"></i>
				<input type="password" class="input-padding form-control form-control-lg" id="password" placeholder="Password" maxlength="128">
			</div>
			<div class="form-group">
				<i class="icon left-icon bi bi-key"></i>
				<i class="icon right-icon bi bi-eye-slash eye-icon"></i>
				<input type="password" class="input-padding form-control form-control-lg" id="confirm-password" placeholder="Confirm Password" maxlength="128">
			</div>
			<div>
				<button type="submit" class="btn btn-primary btn-submit">Sign Up</button>
			</div>
			<div>
				<button type="button" class="btn btn-outline-primary btn-signin">Already has an account? Sign in here</button>
			</div>
		</form>
	`;
	return html;
}

export default class SignupForm extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
	}

	#styles() {
			if (styles)
				return `@scope (.${this.elmtId}) {${styles}}`;
			return null;
	}

	#html(data){
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#scripts() {
		this.#showHidePassword();
		this.#submit();
		this.#redirectToSignInForm();
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

	#isValidUsername(username) {
		var regex = /^[a-zA-Z0-9_-]+$/;
		return regex.test(username);
	}

	#getInvalidFields(data) {
		const invalidFilds = {};
	
		for (const [key, value] of Object.entries(data)) {
			if (!value)
				invalidFilds[key] = "empty";
			else if (key === "email" && !this.#isValidEmail(value))
				invalidFilds.email = "invalid";
			else if (key === "username" && !this.#isValidUsername(value))
				invalidFilds.username = "invalid";
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
		const loginForm = this.html.querySelector("#signup-form");
		loginForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const dataForm = this.#getdInputData();
			const invalidFilds = this.#getInvalidFields(dataForm);
			this.#removeAllInvalidStyles();
			if (Object.keys(invalidFilds).length)
				this.#setAllFormErrors(invalidFilds);
			else
				callAPI("POST", "http://127.0.0.1:8000/api/auth/register", dataForm, this.#apiResHandlerCalback);
		});
	}

	#apiResHandlerCalback = (res, data) => {
		if (res.ok && data.message === "success")
			redirect("/");
		else
			this.#handleApiFormErrors(res.status, data.message);
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
			if (key === "email" && value === "invalid")
				this.#updateAlertMessage("Invalid email");
			else if (key === "username" && value === "invalid")
				this.#updateAlertMessage("Invalid username");
			else if (key === "password" && value === "unmatch")
				this.#updateAlertMessage("Unmatched passwords");
			else if (value === "empty")
				emptyFilds = true;
		}
		if (emptyFilds)
			this.#updateAlertMessage("Required fields");
	}

	#handleApiFormErrors(status, message) {
		
		console.log(status);
		console.log(message);

		if (status == 400)
			this.#showAlertMessage("Invalid Form");
		if (status == 409) {
			this.#showAlertMessage(message);
			if (message.indexOf("Username") > -1)
				this.#setInvalidInputStyle("username");
			else if (message.indexOf("Email") > -1)
				this.#setInvalidInputStyle("email");
		} 
	}
}

customElements.define("signup-form", SignupForm);