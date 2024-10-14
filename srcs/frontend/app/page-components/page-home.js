import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { callAPI } from "../utils/callApiUtils.js";

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
		<side-panel selected="home" language=${data.language}></side-panel>
		<div class="content content-small">
			<div class="profile-container">
				<div class="profile">
					<user-profile username="${username}" language=${data.language}></user-profile>
				</div>
				<div class="history">
					<game-history username="${username}" language=${data.language}></game-history>
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

		this.data = {};
		this.#loadInitialData();
	}

	async #loadInitialData() {
		await callAPI("GET", "/settings/", null, (res, data) => {
			if (res.ok) {
				if (data && data.settings.language){
					this.data.language = data.settings.language;
				}

				this.#initComponent();
				this.#scripts();
			}
		});
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}


	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageHome.componentName, PageHome);
