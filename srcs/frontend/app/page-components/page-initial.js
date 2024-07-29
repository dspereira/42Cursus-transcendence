import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";
import {colors} from "../js/globalStyles.js";

const styles = `
	.login-box {
		position: absolute;
		display: flex;
		width: 50%;
		height: 40%;
		border-style: hidden;
		border-radius: 10px;
		z-index:100;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -40%);
		justify-content: center;
		align-items: center;
		color: ${colors.primary_text};
		background: rgba(20, 20, 20, 0.5);
	}

	app-background {
		position: absolute;
		width:100%;
		z-index:1;
	}
`;

const getHtml = function(data) {
	const html = `
		<h1>Initial Page</h1>
		<br>
		<div class=login-box>
			<button type="button" class="btn btn-primary" id="login">Login</button>
			<button type="button" class="btn btn-secondary" id="signup">SignUp</button>
		</div>
		<app-background></app-background>
	`;
	return html;
}

const title = "initial Page";

export default class PageInitial extends HTMLElement {
	static #componentName = "page-initial";

	constructor() {
		super()
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

		login.addEventListener("click", (event) => {
			redirect("/login");
		});

		signup.addEventListener("click", (event) => {
			redirect("/signup"); 
		})
	}
}

customElements.define(PageInitial.componentName, PageInitial);
