
import { adjustContent } from "../utils/adjustContent.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<h1>Server or network is down, please try again later</h1>
	`;
	return html;
}

const title = "BlitzPong - Error";

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
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageError.componentName, PageError);
