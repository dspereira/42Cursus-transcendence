import {redirect} from "../js/router.js";
import {callAPI} from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js"
import { render } from "../js/router.js";
import PageEmailResend from "../page-components/page-email-resend.js";
import { getDynamicHtmlElm, getHtmlElm } from "../utils/getHtmlElmUtils.js";
import Page2FA from "../page-components/page-2fa.js";
import componentSetup from "../utils/componentSetupUtils.js";
const EMAIL_NOT_VERIFIED_MSG = 'Email not verified. Please verify your email.';

const styles = `
form {
	position: relative;
}

.card-background {
	background-color: ${colors.main_card};
	color: ${colors.primary_text};
}

.card-background:focus {
	background-color: ${colors.main_card};
	color: ${colors.primary_text};
}

input:-internal-autofill-selected {
	background-color: ${colors.second_card};
}

.highlight-text {
	text-align: center;
	font-size: 32px;
	margin-top: 0px;
	color: ${colors.primary_text};
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

#login-form {
	width: 100%;
}

#email, #password, #email::placeholder, #password::placeholder {
	color: ${colors.primary_text};
	background-image: none;
}

#email:focus::placeholder, #password:focus::placeholder {
	color: ${colors.second_text};
}

h1 {
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

.btn-signup {
	width: 100%;
	border: 2px solid ${colors.btn_default};
	color: ${colors.second_text};
}

.btn-signup:hover {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.logo-img {
	width: 70%;
	height: auto;
	margin-top: 40px;
}

.logo-container {
	display: flex;
	width: 90%;
	justify-content: center;
}

input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active {
	-webkit-background-clip: text;
	-webkit-text-fill-color: #ffffff;
	transition: background-color 5000s ease-in-out 0s;
	box-shadow: inset 0 0 20px 20px #23232329;
}
.btn-resend-email {
	width: 100%;
}

`;

const getHtml = function(data) {
	const html = `
		<div class="main-container">
			<div class="second-container">
				<div class="logo-container">
					<img src="/img/pong-1k.png" class="logo-img" alt="logo">
				</div>
				<div class="highlight-text">Sign in</div>
				<form id="login-form">
					<div class="alert alert-danger hide from" role="alert">
						Invalid authentication credentials.
					</div>
					<div class="form-group">
						<i class="icon left-icon bi-person"></i>
						<input type="text" class="input-padding form-control form-control-lg card-background" id="email" placeholder="Email / Username" maxlength="254">
					</div>
					<div class="form-group">
						<i class="icon left-icon bi bi-key"></i>
						<i class="icon right-icon bi bi-eye-slash eye-icon"></i>
						<input type="password" class="input-padding form-control form-control-lg card-background" id="password" placeholder="Password" maxlength="25">
					</div>
					<div>
						<button type="submit" class="btn btn-primary btn-submit">Sign In</button>
					</div>
					<div>
						<button type="button" class="btn btn-outline-primary btn-signup">Without an account? Create one here</button>
					</div>
				</form>
			</div>
			<div class=ball></div>
			<div class=paddle id=left></div>
			<div class=paddle id=right></div>
			<div class="blur-test"></div>
		</div>
	`;
	return html;
}

export default class LoginForm extends HTMLElement {
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

		this.signupBtn = this.html.querySelector(".btn-signup");
		this.submitBtn = this.html.querySelector(".btn-submit");
		this.resendEmailBtn = this.html.querySelector(".btn-resend-email");
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
		this.signupBtn.addEventListener("click", (event) => {
			redirect("/signup");
		});
	}

	#submit() {
		const loginForm = this.html.querySelector("#login-form");
		loginForm.addEventListener("submit", (event) => {
			event.preventDefault();
			this.submitBtn.disabled = true;
			const dataForm = {
				username: this.html.querySelector('#email').value.trim(),
				password: this.html.querySelector('#password').value.trim()
			}
			if (!dataForm.username || !dataForm.password) {
				this.#setLogInErrorStyles();
				this.submitBtn.disabled = false;
			}
			else
				callAPI("POST", "/auth/login", dataForm, this.#apiResHandlerCalback);
		});
	}

	#apiResHandlerCalback = (res, data) => {
		const value = this.html.querySelector('#email').value.trim();
		if (res.ok && data.message === "success")
			render(getHtmlElm(Page2FA));
		else if (res.status == 401 && data.message == EMAIL_NOT_VERIFIED_MSG)
			render(getDynamicHtmlElm(PageEmailResend, value ,"key"));
		else {
			if (data && data.message)
				this.#setLogInErrorStyles(data.message);
		}
		this.submitBtn.disabled = false;
	}

	#setLogInErrorStyles(message) {
		const inputs = this.html.querySelectorAll('input');
		if (!inputs)
			return ;
		inputs.forEach(input => {
			input.classList.add("is-invalid");
		})
		const alert = this.html.querySelector(".alert");
		if (alert.classList.contains("hide")) {
			alert.classList.add("show");
			alert.classList.remove("hide");
		}
		if (message)
			alert.innerHTML = message;
	}
}

customElements.define("login-form", LoginForm);
