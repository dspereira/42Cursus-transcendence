import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";

const styles = `

`;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<side-panel selected="play"></side-panel>
	<div class="content content-small">
		<h1>Tournaments</h1>
		<!--<tourney-graph></tourney-graph>-->
		<!--<tourney-lobby></tourney-lobby>-->

		<button type="button" class="btn btn-primary btn-create-tourney">Create Tornement</button>

	</div>
	`;
	return html;
}

const title = "Tournaments";

export default class PageTournaments extends HTMLElement {
	static #componentName = "page-tournaments";

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
		this.#createTornementEvent();
	}


	#createTornementEvent() {
		const btn = this.html.querySelector(".btn-create-tourney");
		btn.addEventListener("click", () => {
			callAPI("POST", `http://127.0.0.1:8000/api/tournament/`, null, (res, data) => {					
				if (res.ok) {
					const content = this.html.querySelector(".content");
					content.innerHTML = "<tourney-lobby></tourney-lobby>";
				}
			});
		});
	}

}

customElements.define(PageTournaments.componentName, PageTournaments);
