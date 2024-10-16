import { adjustContent } from "../utils/adjustContent.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";
import componentSetup from "../utils/componentSetupUtils.js";
import getLanguageDict from "../utils/languageUtils.js";
import { enPageTournamentInfoDict } from "../lang-dicts/enLangDict.js";
import { ptPageTournamentInfoDict } from "../lang-dicts/ptLangDict.js";
import { esPageTournamentInfoDict } from "../lang-dicts/esLangDict.js";

const styles = `

`;

const getHtml = function(data) {
	const info = JSON.stringify(data.info);
	const html = `
	<app-header></app-header>
	<side-panel selected="tournaments" language=${data.language}></side-panel>
	<div class="content content-small">
		<tourney-info info='${info}' language=${data.language}></tourney-info>
	</div>
	`;
	return html;
}


const title = "BlitzPong - Tournament Info";

export default class PageTournamentInfo extends HTMLElement {
	static #componentName = "page-tournament-info";
	static observedAttributes = ["id"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		if (!this.data.id) {
			render("<page-404></page-404>");
		}
		else {
			callAPI("GET", `/tournament/info/?id=${this.data.id}`, null, (res, data) => {
				if (res.ok && data && data.info) {
					this.data["info"] = data.info;
					this.#start();
				}
				else
					render("<page-404></page-404>");
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}	

	static get componentName() {
		return this.#componentName;
	}

	async #start() {
		await callAPI("GET", "/settings/", null, (res, data) => {
			if (res.ok) {
				if (data && data.settings.language){
					this.data.language = data.settings.language;
					this.data.langDict = getLanguageDict(this.data.language, enPageTournamentInfoDict, ptPageTournamentInfoDict, esPageTournamentInfoDict);
				}
		}
		});

		this.#initComponent();
		this.#scripts();
	}

	#initComponent() {
		document.title = this.data.langDict.title;
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageTournamentInfo.componentName, PageTournamentInfo);
