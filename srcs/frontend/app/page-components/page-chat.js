import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { callAPI } from "../utils/callApiUtils.js";
import getLanguageDict from "../utils/languageUtils.js";
import { enPageChatDict } from "../lang-dicts/enLangDict.js";
import { ptPageChatDict } from "../lang-dicts/ptLangDict.js";
import { esPageChatDict } from "../lang-dicts/esLangDict.js";

const styles = `

`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="chat" language=${data.language}></side-panel>
		<div class="content content-small">
			<app-chat language=${data.language}></app-chat>
		</div>
	`;
	return html;
}


const title = "BlitzPong - Chat";

export default class PageChat extends HTMLElement {
	static #componentName = "page-chat";

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
					this.data.langDict = getLanguageDict(this.data.language, enPageChatDict, ptPageChatDict, esPageChatDict);
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
		this.#resetChatStates();
	}

	#resetChatStates() {
		stateManager.setState("chatMessagesCounter", 0);
	}
}

customElements.define(PageChat.componentName, PageChat);
