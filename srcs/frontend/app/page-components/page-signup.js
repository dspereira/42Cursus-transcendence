import componentSetup from "../utils/componentSetupUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
	<!--<app-header></app-header>-->
		<signup-form></signup-form>
	`;
	return html;
}

const title = "BlitzPong - Signup";

export default class PageSignup extends HTMLElement {
	
	static #componentName = "page-signup";

	constructor() {
		super()
		
		this.#initComponent();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		document.title = title;
		this.html = componentSetup(this, getHtml(), styles);
	}
}

customElements.define(PageSignup.componentName, PageSignup);
