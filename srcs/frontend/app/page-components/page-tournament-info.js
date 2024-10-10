import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";

const styles = `

`;

const getHtml = function(data) {
	const info = JSON.stringify(data.info);
	const html = `
	<app-header></app-header>
	<side-panel selected="tournaments"></side-panel>
	<div class="content content-small">
		<tourney-info info='${info}'></tourney-info>
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
		document.title = title;
	}

	connectedCallback() {
		if (!this.data.id) {
			render("<page-404></page-404>");
		}
		else {
			callAPI("GET", `http://127.0.0.1:8000/api/tournament/info/?id=${this.data.id}`, null, (res, data) => {
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

	#start() {
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
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageTournamentInfo.componentName, PageTournamentInfo);
