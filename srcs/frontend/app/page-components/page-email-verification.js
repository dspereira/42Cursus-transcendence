import stateManager from "../js/StateManager.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<h1>Validação de email</h1>

	`;
	return html;
}

const title = "BlitzPong - Email Verification";

export default class PageEmailVerification extends HTMLElement {
	static #componentName = "page-email-verification";

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
