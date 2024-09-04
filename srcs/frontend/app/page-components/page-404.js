import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";

const styles = `
	.image-container {
		text-align: center;
		padding-top: 50px
	}

	img {
		/*display: inline-block;*/
		width: auto;
		height: 60vh;
		align: center;
	}

	.page-container {
		background-color: #121212;
		height: 100vh;
	}

	.home-btn {
		text-align: center;
	}
`;

const getHtml = function(data) {
	const html = `
		<h1>404 Not Found</h1>-->
		<div class=page-container>
			<div class="image-container">
				<img src="/img/not_found.jpg" alt="404 Not Found Image">
			</div>
			<div class="home-btn">
				<button type="button" class="btn btn-primary btn-lg">Go Home</button>
			</div>
		<div>
	`;
	return html;
}

const title = "404 Not Found";

export default class Page404 extends HTMLElement {

	static #componentName = "page-404";

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
		this.#homeBtnEvent();
	}

	#homeBtnEvent() {
		const btn = this.html.querySelector(".home-btn");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			redirect("/");
		});
	}
}

customElements.define(Page404.componentName, Page404);
