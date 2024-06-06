import {redirect} from "../js/router.js";
import {callAPI} from "../utils/callApiUtils.js";

const styles = `
form {
	position: relative;
}

.icon {
	position: absolute;
	margin-top: 3px;
	font-size: 28px;
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

#email, #password {
	background-image: none;
}

h1 {
	text-align: center;
	margin-top: 30px;
	margin-bottom: 30px;
}

.btn-submit {
	width: 100%;
	margin-top: 30px;
}

.btn-signup {
	width: 100%;
}

`;

const getHtml = function(data) {
	const html = `
		<h1>Sign in</h1>
		<form id="login-form">
			<div class="alert alert-danger hide" role="alert">
				Invalid authentication credentials.
			</div>
			<div class="form-group">
				<i class="icon left-icon bi-person"></i>
				<input type="text" class="input-padding form-control form-control-lg" id="email" placeholder="Email / Username" maxlength="100">
			</div>
			<div class="form-group">
				<i class="icon left-icon bi bi-key"></i>
				<i class="icon right-icon bi bi-eye-slash eye-icon"></i>
				<input type="password" class="input-padding form-control form-control-lg" id="password" placeholder="Password" maxlength="128">
			</div>
			<div>
				<button type="submit" class="btn btn-primary btn-submit">Sign In</button>
			</div>
			<div>
				<button type="button" class="btn btn-outline-primary btn-signup">Without an account? Create one here</button>
			</div>
		</form>
	`;
	return html;
}

export default class LoginForm extends HTMLElement {
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
		this.#redirectToSignUpForm();
	}

	#showHidePassword() {
		let input = this.html.querySelector("#password");
		let eye = this.html.querySelector(".eye-icon");
		
		eye.addEventListener("click", () => {
			const openEye = "bi-eye";
			const closeEye = "bi-eye-slash";
			eye.classList.toggle(openEye);
			eye.classList.toggle(closeEye);
			input.type = input.type === "password" ? "text" : "password";
		});
	}

	#redirectToSignUpForm() {
		const btn = this.html.querySelector(".btn-signup");
		btn.addEventListener("click", (event) => {
			redirect("/signup");
		});
	}

	#submit() {
		const loginForm = this.html.querySelector("#login-form");
		loginForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const dataForm = {
				username: document.querySelector('#email').value.trim(),
				password: document.querySelector('#password').value.trim()
			}
			if (!dataForm.username || !dataForm.password)
				this.#setInvalidCredentialsStyle();
			else
				callAPI("POST", "http://127.0.0.1:8000/api/auth/login", dataForm, this.#apiResHandlerCalback);
		});
	}

	#apiResHandlerCalback = (res, data) => {
		if (res.ok && data.message === "success")
			redirect("/");
		else
			this.#setInvalidCredentialsStyle();
	}

	#setInvalidCredentialsStyle() {
		const inputs = document.querySelectorAll('input');
		inputs.forEach(input => {
			input.classList.add("is-invalid");
		})
		const alert = document.querySelector(".alert");
		if (alert.classList.contains("hide"))
		{
			alert.classList.add("show");
			alert.classList.remove("hide");
		}	
	}
}

customElements.define("login-form", LoginForm);