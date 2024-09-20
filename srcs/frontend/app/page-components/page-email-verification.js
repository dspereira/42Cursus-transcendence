import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";

const styles = ``;

const getHtml = function(data) {

	console.log(data);

	

	const html = `


		<h1>Validação de email</h1>
	
	`;
	return html;
}

const title = "BlitzPong - Email Verification";

const INVALID_TOKEN = "invalid_token";
const VALIDATED_TOKEN = "validated_token";
//const INVALID_TOKEN = "invalid_token";
//const VALIDATED_TOKEN = "validated_token";



export default class PageEmailVerification extends HTMLElement {
	static #componentName = "page-email-verification";
	static observedAttributes = ["token"];

	constructor() {
		super()
		this.data = {};
	}

	static get componentName() {
		return this.#componentName;
	}

	connectedCallback() {
		if (!this.data.token) {
			render("<page-404></page-404>");
		}
		else {
			replaceCurrentRoute("/email-verification");
			callAPI("POST", `http://127.0.0.1:8000/api/auth/validate-email`, {email_token: this.data.token}, (res, data) => {
				
				console.log(res);
				console.log(data);
				
				if (res.ok) {
					// token já validado ou validado com successo
					if (data && data.validation_status=="validated")
						this.data["state"] = VALIDATED_TOKEN;
				}
				else {
					// token inválido ou outros erros
					this.data["state"] = INVALID_TOKEN;
				}
				this.#start();
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}	

	#start() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
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

	}
}

customElements.define(PageEmailVerification.componentName, PageEmailVerification);

const replaceCurrentRoute = function(route) {
	window.history.replaceState({route: route}, null, route);
}