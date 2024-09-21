import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<h1>2FA</h1>
		<div class="option-2fa"><div>
	`;
	return html;
}

const title = "2FA page";

export default class Page2FA extends HTMLElement {
	static #componentName = "page-2fa";

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
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
		this.option2fa = this.html.querySelector(".option-2fa");
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
		this.#get2faOption();
	}

	#get2faOption() {
		callAPI("GET", `http://127.0.0.1:8000/api/two-factor-auth/configured-2fa/`, null, (res, data) => {			
			if (res.ok && data && data.configured_methods) {
				if (data.configured_methods.qr_code)
					this.option2fa.innerHTML = "Qr code";
				else if (data.configured_methods.email)
					this.option2fa.innerHTML = "<tfa-email></tfa-email>";
				else if (data.configured_methods.phone)
					this.option2fa.innerHTML = "phone";
			}
		});
	}
}

customElements.define(Page2FA.componentName, Page2FA);
