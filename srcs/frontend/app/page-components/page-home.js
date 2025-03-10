import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { colors } from "../js/globalStyles.js";
import { callAPI } from "../utils/callApiUtils.js";
import getLanguageDict from "../utils/languageUtils.js";
import { enPageHomeDict } from "../lang-dicts/enLangDict.js";
import { ptPageHomeDict } from "../lang-dicts/ptLangDict.js";
import { esPageHomeDict } from "../lang-dicts/esLangDict.js";

const styles = `
	.profile-container {
		min-width: 460px;
		flex-direction: row;
		color: ${colors.second_text};
		display: flex;
		justify-content: center;
		gap: 50px;
	}

	.profile {
		width: 30%;
		min-width: 280px;
	}

	.history {
		width: 70%;
		min-width: 350px;
	}

	@media (max-width: 1100px) {
		.profile-container {
			flex-direction: column;
			align-items: center;
		}

		.history {
			width: 100%;
		}

		.profile {
			width: 100%;
		}
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

		this.data = {};
		this.#loadInitialData();
	}

	async #loadInitialData() {
		await callAPI("GET", "/settings/", null, (res, data) => {
			if (res.ok) {
				if (data && data.settings.language){
					this.data.language = data.settings.language;
					this.data.langDict = getLanguageDict(this.data.language, enPageHomeDict, ptPageHomeDict, esPageHomeDict);

				}

				this.#initComponent();
				this.#scripts();
			}
		});
	}

	#initComponent() {
		document.title = this.data.langDict.title;
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
