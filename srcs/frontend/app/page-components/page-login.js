import componentSetup from "../utils/componentSetupUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
	<!--<app-header></app-header>-->
		<login-form></login-form>
	`;
	return html;
}

const title = "BlitzPong - Login";

export default class PageLogin extends HTMLElement {
	static #componentName = "page-login";

	constructor() {
		super()

		document.title = title;

		this.#initComponent();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);
	}
}

customElements.define(PageLogin.componentName, PageLogin);
