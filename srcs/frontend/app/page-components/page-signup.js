import componentSetup from "../utils/componentSetupUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
	<!--<app-header></app-header>-->
	
	<div class="row">
	  <div class="col-md-4 offset-md-4">
		  <signup-form></signup-form>
	  </div>
	</div>
	`;
	return html;
}

const title = "BlitzPong - Signup";

export default class PageSignup extends HTMLElement {
	
	static #componentName = "page-signup";

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

customElements.define(PageSignup.componentName, PageSignup);
