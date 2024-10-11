import { redirect } from "../js/router.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `

`;

const getHtml = function(data) {
	const html = `
		<h1>Initial Page</h1>
		<br>
		<button type="button" class="btn btn-primary" id="login">Login</button>
		<button type="button" class="btn btn-secondary" id="signup">SignUp</button>
		<button type="button" class="btn btn-secondary" id="localplay">Local Play</button>
	`;
	return html;
}

const title = "BlitzPong - Initial Page";

export default class PageInitial extends HTMLElement {
	static #componentName = "page-initial";

	constructor() {
		super()

		document.title = title;

		this.#initComponent();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);
	}

	#scripts() {
		const login = this.html.querySelector("#login");
		const signup = this.html.querySelector("#signup");
		const localplay = this.html.querySelector("#localplay");

		login.addEventListener("click", (event) => {
			redirect("/login");
		});

		signup.addEventListener("click", (event) => {
			redirect("/signup"); 
		})

		localplay.addEventListener("click", (event) => {
			redirect("/localplay"); 
		})
	}
}

customElements.define(PageInitial.componentName, PageInitial);
