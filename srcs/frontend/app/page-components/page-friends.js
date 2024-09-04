import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";
import { callAPI } from "../utils/callApiUtils.js";

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


const title = "Friends";

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
		await callAPI("GET", "http://127.0.0.1:8000/api/profile/getlanguage", null, (res, data) => {
			if (res.ok) {
				if (data && data.language){
					this.data.language = data.language;
				}
		}
		});

		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
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
