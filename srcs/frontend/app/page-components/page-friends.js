import { adjustContent } from "../utils/adjustContent.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { callAPI } from "../utils/callApiUtils.js";
import getLanguageDict from "../utils/languageUtils.js";
import { enPageFriendsDict } from "../lang-dicts/enLangDict.js";
import { ptPageFriendsDict } from "../lang-dicts/ptLangDict.js";
import { esPageFriendsDict } from "../lang-dicts/esLangDict.js";

const styles = ``;

const getHtml = function(data) {
	const html = `
		<app-header bell="selected"></app-header>
		<side-panel selected="friends" language=${data.language}></side-panel>
		<div class="content content-small">
			<app-friends language=${data.language}></app-friends>
		</div>
	`;
	return html;
}


const title = "BlitzPong - Friends";

export default class PageFriends extends HTMLElement {
	static #componentName = "page-friends";

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
					this.data.langDict = getLanguageDict(this.data.language, enPageFriendsDict, ptPageFriendsDict, esPageFriendsDict);

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

customElements.define(PageFriends.componentName, PageFriends);
