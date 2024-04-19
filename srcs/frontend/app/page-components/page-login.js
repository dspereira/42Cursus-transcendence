const page = 
`
<h1>Page Login</h1>
`;

const title = "Login Page";

export default class PageLogin extends HTMLElement {

	static #componentName = "page-login";

	constructor() {
		super()
		this.innerHTML = page;
		document.querySelector("head title").innerHTML = title;
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageLogin.componentName, PageLogin);
