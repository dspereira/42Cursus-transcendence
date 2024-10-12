import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `

`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="chat"></side-panel>
		<div class="content content-small">
			<app-chat></app-chat>
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
		this.#resetChatStates();
	}

	#resetChatStates() {
		stateManager.setState("chatMessagesCounter", 0);
	}
}

customElements.define(PageChat.componentName, PageChat);
