import { adjustContent } from "../utils/adjustContent.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
`;

const getHtml = function(data) {
	const html = `
		<app-header bell="selected"></app-header>
		<side-panel selected="friends"></side-panel>
		<div class="content content-small">
			<app-friends></app-friends>
		</div>
	`;
	return html;
}


const title = "BlitzPong - Friends";

export default class PageFriends extends HTMLElement {
	static #componentName = "page-friends";

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

customElements.define(PageFriends.componentName, PageFriends);
