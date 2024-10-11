import componentSetup from "../utils/componentSetupUtils.js";
import { redirect } from "../js/router.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<h1>Server is down, please try again later</h1>
		<button type="button" class="btn btn-primary btn-home">Go Home</button>
	`;
	return html;
}

const title = "BlitzPong - Server Error";

export default class PageError extends HTMLElement {
	static #componentName = "page-error";

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
		this.#goHomeBtnEvent();
	}

	#goHomeBtnEvent() {
		const btn = this.html.querySelector(".btn-home");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			redirect("/");
		});
	}
}

customElements.define(PageError.componentName, PageError);
