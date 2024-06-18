import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";

const styles = ``;

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


const title = "Friends";

export default class PageFriends extends HTMLElement {
	static #componentName = "page-friends";

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
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageFriends.componentName, PageFriends);
