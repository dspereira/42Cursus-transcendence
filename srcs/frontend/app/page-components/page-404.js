import { redirect } from "../js/router.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
	.image-container {
		text-align: center;
		padding-top: 50px
	}

	img {
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

const title = "BlitzPong - 404 Not Found";

export default class Page404 extends HTMLElement {

	static #componentName = "page-404";

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
