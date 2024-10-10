import stateManager from "../js/StateManager.js";

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
		this.#render();
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
}

customElements.define(PageSignup.componentName, PageSignup);
