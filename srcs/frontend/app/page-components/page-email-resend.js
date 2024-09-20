import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";
import { getHtmlElm } from "../utils/getHtmlElmUtils.js";
import PageEmailSent from "./page-email-sent.js";

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

const title = "Email Resend";

export default class PageEmailResend extends HTMLElement {
	static #componentName = "page-email-resend";
	static observedAttributes = ["key"];

	constructor() {
		super()
		this.data = {};
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
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
		stateManager.setState("pageReady", true);
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
			callAPI("POST", `http://127.0.0.1:8000/api/auth/resend-email-validation/`, {info: this.data.key}, (res, data) => {
				if (res.ok)
					render(getHtmlElm(PageEmailSent));	
			});
		});

	}
}

customElements.define(PageEmailResend.componentName, PageEmailResend);
