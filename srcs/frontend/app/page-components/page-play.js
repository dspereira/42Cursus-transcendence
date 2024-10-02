import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js";
import { callAPI } from "../utils/callApiUtils.js";

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

	.alert-div {
		display: flex;
		width: 100%;
		animation: disappear linear 10s forwards;
		background-color: ${colors.alert};
	}
	
	.alert-bar {
		width: 90%;
		height: 5px;
		border-style: hidden;
		border-radius: 2px;
		background-color: ${colors.alert_bar};
		position: absolute;
		bottom: 2px;
		animation: expire linear 10s forwards;
	}
	
	@keyframes expire {
		from {
			width: 90%;
		}
		to {
			width: 0%;
		}
	}
	
	@keyframes disappear {
		0% {
			visibility: visible;
			opacity: 1;
		}
		99% {
			visibility: visible;
			opacity: 1;
		}
		100% {
			visibility: hidden;
			opacity: 0;
			display: none;
		}
	}
`;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<side-panel selected="play"></side-panel>
	<div class="content content-small main-play-container">
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
		this.#errorMsgEvents();
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

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				console.log(msg);
				console.log("this html = ", this.html);
				stateManager.setState("errorMsg", null);
				const mainDiv = this.html.querySelector(".page-1");
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = mainDiv.querySelector(".invite-game");
				console.log("html = ", insertElement.innerHTML);
				var alertCard = document.createElement("div");
				alertCard.className = "alert alert-danger hide from alert-div";
				alertCard.role = "alert";
				alertCard.innerHTML = `
						${msg}
						<div class=alert-bar></div>
					`;
				mainDiv.insertBefore(alertCard, insertElement);
			}
		});
	}

	#inviteToPlayAndRedirectToLobby() {
		const friendId = stateManager.getState("friendIdInvitedFromChat");
		if (!friendId)
			return ;

		stateManager.setState("friendIdInvitedFromChat", null);
		const data = {
			invites_list: [`${friendId}`]
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
		});
	}
}
customElements.define(PagePlay.componentName, PagePlay);
