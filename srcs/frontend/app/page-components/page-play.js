import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
	.invite-game {
		text-align: center;
	}

	.div-border {
		display: inline-block;
		text-align: center;
		border-bottom: 3px solid #EEEDEB;
		width: 60%;
		margin-bottom: 25px;
	}

	.invite-game-btn {
		padding: 10px 70px 10px 70px;
		margin-bottom: 25px;
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

const title = "BlitzPong - Play";

export default class PagePlay extends HTMLElement {
	static #componentName = "page-play";

	constructor() {
		super()

		document.title = title;

		this.#initComponent();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
		this.#setInviteToGameEvent();
		this.#inviteToPlayAndRedirectToLobby();
	}

	#setInviteToGameEvent() {
		const btn = this.html.querySelector(".invite-game-btn");
		const page1 = this.html.querySelector(".page-1");
		const content = this.html.querySelector(".content");
		if (!btn && !page1 && !content)
			return ;
		btn.addEventListener("click", () => {
			content.removeChild(page1);
			content.innerHTML = "<game-invite-send></game-invite-send>";
		});
	}

	#inviteToPlayAndRedirectToLobby() {
		const stateInfo = stateManager.getState("inviteToPlayFriendID");
		if (!stateInfo) 
			return ;

		stateManager.setState("inviteToPlayFriendID", null);
		const data = {
			invites_list: [`${stateInfo}`]
		};

		callAPI("POST", "http://127.0.0.1:8000/api/game/request/", data, (res, data) => {
			if (res.ok) {
				const contentElm = document.querySelector(".content");
				contentElm.innerHTML = `
				<app-lobby 
					lobby-id="${stateManager.getState("userId")}"
				></app-lobby>
				`;
			}
		}, null, getCsrfToken());
	}
}

customElements.define(PagePlay.componentName, PagePlay);
