import { redirect } from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";
import { getHtmlElm } from "../utils/getHtmlElmUtils.js";
import PageEmailSent from "./page-email-sent.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
.mail-info-container {
	max-width: 50%;
	padding: 30px;
	border-radius: 8px;
	text-align: center;
	margin: 50px auto 0px auto;
}

h1 {
	font-size: 32px;
	font-weight: bold;
	margin-bottom: 40px;
}

p {
	color: #333;
	margin-bottom: 40px;
	font-size: 20px;
}
`;

const getHtml = function(data) {
	const html = `
	<div class="mail-info-container">
		<h1>Email Verification Resend</h1>
		<p>This account exists, but it's not verified yet. Click the button below to resend the verification email.</p>
		<button type="button" class="btn btn-primary btn-resend">Resend Email</button>
		<button type="button" class="btn btn-primary btn-home">Go Home</button>
	</div>
	`;
	return html;
}

const title = "BlitzPong - Email Resend";

export default class PageEmailResend extends HTMLElement {
	static #componentName = "page-email-resend";
	static observedAttributes = ["key"];

	constructor() {
		super()
		this.data = {};

		document.title = title;

		this.#initComponent();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}	

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		this.#rediretionToHomeBtn();
		this.#resendEmailBtn();
	}

	#rediretionToHomeBtn() {
		const btn = this.html.querySelector(".btn-home");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			redirect("/");
		});
	}

	#resendEmailBtn() {
		const btn = this.html.querySelector(".btn-resend");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			btn.disabled = true;
			callAPI("POST", `http://127.0.0.1:8000/api/auth/resend-email-validation/`, {info: this.data.key}, (res, data) => {
				if (res.ok) 
					render(getHtmlElm(PageEmailSent));	
				btn.disabled = false; 
			});
		});
	}
}

customElements.define(PageEmailResend.componentName, PageEmailResend);
