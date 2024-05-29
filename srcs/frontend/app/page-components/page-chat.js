import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";

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


const title = "Chat";

export default class PageChat extends HTMLElement {
	static #componentName = "page-chat";

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
	}

	#styles() {
		if (styles)
			return `@scope (.${this.elmtId}) {${styles}}`;
		return null;
	}

	#html(data){
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
		stateManager.setState("pageReady", true);

		console.log("CHAT PAGE");

	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageChat.componentName, PageChat);
