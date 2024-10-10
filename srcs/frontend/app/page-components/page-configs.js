import { adjustContent } from "../utils/adjustContent.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="configurations"></side-panel>
		<div class="content content-small">
			<app-configs></app-configs>
		</div>
	`;
	return html;
}

const title = "BliyzPong - Configurations";

export default class PageConfigs extends HTMLElement {
	static #componentName = "page-configs";

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

customElements.define(PageConfigs.componentName, PageConfigs);
