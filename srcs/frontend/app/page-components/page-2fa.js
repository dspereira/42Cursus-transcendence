import {redirect} from "../js/router.js";
import { callAPI } from "../utils/callApiUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
.tfa-methods {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.message {
	background: none;
	border: none;
	color: blue;
	cursor: pointer;
	padding: 0;
	font: inherit;
}

.methods {
	width: 50%;
}

.hide {
	display: none;
}

`;

const getHtml = function(data) {
	const html = `
		<h1>2FA</h1>
		<div class="option-2fa"></div>

		<div class="tfa-methods">
			<button class="message">Select an alternative authentication method</button>
			<div class="list-group methods hide">
				<button type="button" class="list-group-item list-group-item-action hide" id="qr_code">Use QR Code</button>
				<button type="button" class="list-group-item list-group-item-action hide" id="email">Use Email</button>
				<button type="button" class="list-group-item list-group-item-action hide" id="phone">Use Mobile Phone</button>
			</div>
		<div>
	`;
	return html;
}

const title = "BlitzPong - 2FA";

export default class Page2FA extends HTMLElement {
	static #componentName = "page-2fa";

	constructor() {
		super()

		document.title = title;

		this.chosenMethod;
		this.methodsObj;
		this.#initComponent();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);

		this.option2fa = this.html.querySelector(".option-2fa");
		this.msgBtn = this.html.querySelector(".message");
		this.methods = this.html.querySelector(".methods");
	}

	#scripts() {
		this.#get2faOption();
		this.#selectAnAlternativeMsgEvent();
		this.#setChooseMethodsBtnEvents();
	}

	#get2faOption() {
		callAPI("GET", `/two-factor-auth/configured-2fa/`, null, (res, data) => {	
			if (res.ok && data) {
				this.#setAllowedMethods(data.configured_methods);
				this.#setChosenMethod(data.method);
				this.#update2faMethod();
			}
			else if (!res.ok) {
				console.log("Error: Genting 2fa Configs.");
				redirect("/");
			}
		});
	}

	#selectAnAlternativeMsgEvent() {
		this.msgBtn.addEventListener("click", () => {
			this.methods.classList.remove("hide");
			this.msgBtn.classList.add("hide");
		});
	}

	#setChooseMethodsBtnEvents() {
		const btnList = this.html.querySelectorAll(".methods > button");
		if (!btnList)
			return ;
		btnList.forEach((elm) => {
			elm.addEventListener("click", () => {
				this.#setChosenMethod(elm.id);
				this.#update2faMethod();
			});
		});
	}

	#manageAllowedMethods() {
		if (!this.methodsObj.phone && !this.methodsObj.qr_code) {
			this.methods.classList.add("hide");
			this.msgBtn.classList.add("hide");
			return ;
		}
		let elm;
		for (let key in this.methodsObj) {
			elm = this.html.querySelector(`#${key}`);
			if (this.methodsObj[key] && key != this.chosenMethod)
				elm.classList.remove("hide");
			else
				elm.classList.add("hide");
		}
	}

	#update2faMethod() {
		this.methods.classList.add("hide");
		this.msgBtn.classList.remove("hide");
		this.#manageAllowedMethods();
		this.option2fa.innerHTML = 
		`<tfa-form 
			method=${this.chosenMethod}
			></tfa-form>`;
	}

	#setChosenMethod(method) {
		this.chosenMethod = method;
	}

	#setAllowedMethods(methods) {
		this.methodsObj = methods;
	}
}

customElements.define(Page2FA.componentName, Page2FA);
