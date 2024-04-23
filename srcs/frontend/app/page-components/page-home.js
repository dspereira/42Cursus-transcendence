import AppHeader from "../components/app-header.js";

const page = 
`

<app-header></app-header>

`;

const title = "Home Page";

export default class PageHome extends HTMLElement {

	static #componentName = "page-home";

	constructor() {
		super()
		this.innerHTML = page;
		document.querySelector("head title").innerHTML = title;
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageHome.componentName, PageHome);
