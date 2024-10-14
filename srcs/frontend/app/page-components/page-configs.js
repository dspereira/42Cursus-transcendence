import { adjustContent } from "../utils/adjustContent.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { callAPI } from "../utils/callApiUtils.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="configurations" language=${data.language}></side-panel>
		<div class="content content-small">
			<app-configs language=${data.language}></app-configs>
		</div>
	`;
	return html;
}

const title = "BlitzPong - Configurations";

export default class PageConfigs extends HTMLElement {
	static #componentName = "page-configs";

	constructor() {
		super()

		document.title = title;
		

		this.data = {};
		this.#loadInitialData();
	}

	static get componentName() {
		return this.#componentName;
	}

	async #loadInitialData() {
		await callAPI("GET", "/settings/", null, (res, data) => {
			if (res.ok) {
				if (data && data.settings.language){
					this.data.language = data.settings.language;
				}
		}
		});

		this.#initComponent();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageConfigs.componentName, PageConfigs);
