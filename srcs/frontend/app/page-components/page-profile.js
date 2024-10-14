import { redirect, render } from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";
import componentSetup from "../utils/componentSetupUtils.js";

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
	const html = `
		<app-header></app-header>
		<side-panel></side-panel>
		<div class="content content-small">
			<div class="profile-container">
				<div class="profile">
					<user-profile username="${data.username}"></user-profile>
				</div>
				<div class="history">
					<game-history username="${data.username}"></game-history>
				</div>
			</div>
		</div>
	`;
	return html;
}

const title = "BlitzPong - Profile";

export default class PageProfile extends HTMLElement {
	static #componentName = "page-profile";
	static observedAttributes = ["username"];

	constructor() {
		super()
		this.data = {};
		document.title = title;
	}

	connectedCallback() {
		if (!this.data.username) {
			this.data.username = stateManager.getState("username");
			this.#start();
		}
		else {
			callAPI("GET", `/profile/exists/?username=${this.data.username}`, null, (res, data) => {
				if (res.ok && data && data.exists)
					this.#start();
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
		this.#scripts();
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageProfile.componentName, PageProfile);
