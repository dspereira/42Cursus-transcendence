const page = 
`
<a href="/">Home</a>
<h1>404 Not Found</h1>

`;

const title = "404 Not Found";

export default class Page404 extends HTMLElement {

	static #componentName = "page-404";

	constructor() {
		super()
		this.innerHTML = page;
		document.querySelector("head title").innerHTML = title;
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(Page404.componentName, Page404);
