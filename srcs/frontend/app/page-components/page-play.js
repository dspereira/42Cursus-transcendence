import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js";

const styles = `
	.invite-game {
		text-align: center;
	}

	.div-border {
		display: inline-block;
		text-align: center;
		border-bottom: 3px solid ${colors.second_card};
		width: 60%;
		margin-bottom: 25px;
	}

	.invite-game-btn {
		background-color: ${colors.btn_default};
		border-style: hidden;
		color: ${colors.primary_text};
		padding: 10px 70px 10px 70px;
		margin-bottom: 25px;
	}

	.invite-game-btn:hover {
		background-color: ${colors.btn_hover};
		color: ${colors.second_text};
	}

	.page-1 {
		min-width: 460px;
	}

`;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<side-panel selected="play"></side-panel>
	<div class="content content-small">
		<div class="page-1">
			<div class="invite-game">
				<button type="button" class="btn btn-primary invite-game-btn">Invite to Game</button>
				<div></div>
				<div class="div-border"></div>
			</div>
			<game-invite-request></game-invite-request>
		</div>
	</div>
	`;
	return html;
}

const title = "Play";

export default class PagePlay extends HTMLElement {
	static #componentName = "page-play";

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
		this.#setInviteToGameEvent()
	}

	#setInviteToGameEvent() {
		const btn = this.html.querySelector(".invite-game-btn");
		const page1 = this.html.querySelector(".page-1");
		const content = this.html.querySelector(".content");
		if (!btn && !page1 && !content)
			return ;
		btn.addEventListener("click", () => {

			// api/game/game
			content.removeChild(page1);
			content.innerHTML = "<game-invite-send></game-invite-send>";
		});
	}
}

customElements.define(PagePlay.componentName, PagePlay);
