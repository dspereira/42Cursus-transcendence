import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { callAPI } from "../utils/callApiUtils.js";

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

	#initComponent() {
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
