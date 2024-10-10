import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";

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
		this.#render();
		this.#scripts();
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
