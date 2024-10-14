import componentSetup from "../utils/componentSetupUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
	<!--<app-header></app-header>-->
	<div class="row">
	  <div class="col-md-4 offset-md-4">
		<login-form></login-form>
	  </div>
	</div>
	`;
	return html;
}

const title = "BlitzPong - Login";

export default class PageLogin extends HTMLElement {
	static #componentName = "page-login";

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

customElements.define(PageLogin.componentName, PageLogin);
