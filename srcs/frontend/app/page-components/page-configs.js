import { adjustContent } from "../utils/adjustContent.js";
import { colors } from "../js/globalStyles.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { callAPI } from "../utils/callApiUtils.js";
import getLanguageDict from "../utils/languageUtils.js";
import { enPageConfigsDict } from "../lang-dicts/enLangDict.js";
import { ptPageConfigsDict } from "../lang-dicts/ptLangDict.js";
import { esPageConfigsDict } from "../lang-dicts/esLangDict.js";

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
					this.data.langDict = getLanguageDict(this.data.language, enPageConfigsDict, ptPageConfigsDict, esPageConfigsDict);
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
		document.title = this.data.langDict.title;
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageConfigs.componentName, PageConfigs);
