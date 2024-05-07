const page = 
`
<a href="/login">login</a>
<h1>Page Signup</h1>
`;

const title = "Signup Page";

export default class PageSignup extends HTMLElement {
	
	static #componentName = "page-signup";

	constructor() {
		super()
		this.innerHTML = page;
		document.querySelector("head title").innerHTML = title;
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageSignup.componentName, PageSignup);
