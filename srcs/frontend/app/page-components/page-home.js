import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";

const styles = `
	.profile-container {
		display: flex;
		justify-content: flex-start;
		gap: 50px;
	}

	.profile {
		width: 30%;
	}

	.history {
		width: 70%;
	}
`;

const getHtml = function(data) {
	const username = stateManager.getState("username");
	const html = `
		<app-header></app-header>
		<side-panel selected="home"></side-panel>
		<div class="content content-small">
			<div class="profile-container">
				<div class="profile">
					<user-profile username="${username}"></user-profile>
				</div>
				<div class="history">
					<game-history username="${username}"></game-history>
				</div>
			</div>
		</div>
	`;
	return html;
}

const title = "BlitzPong - Home Page";

export default class PageHome extends HTMLElement {
	static #componentName = "page-home";

	constructor() {
		super()

		document.title = title;

		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	#initComponent() {
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		this.html = document.createElement("div");
		this.html.classList.add(`${this.elmtId}`);
		this.styles = document.createElement("style");
		this.styles.textContent = this.#styles();
		this.html.innerHTML = this.#html();
	}

	#styles() {
		if (styles)
			return `@scope (.${this.elmtId}) {${styles}}`;
		return null;
	}

	#html(data) {
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


	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageHome.componentName, PageHome);
