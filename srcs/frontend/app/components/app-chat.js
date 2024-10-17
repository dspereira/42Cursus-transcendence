import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";
import { colors } from "../js/globalStyles.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { enAppChatDict } from "../lang-dicts/enLangDict.js";
import { ptAppChatDict } from "../lang-dicts/ptLangDict.js";
import { esAppChatDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
.chat {
	display: flex;
	min-width: 460px;
	gap: 20px;
	height: 90vh;
}

.chat-area {
	width: 100%;
}

.hide {
	display: none;
}

.link {
	color: ${colors.link};
	text-decoration: underline;
	cursor: pointer;
}

.link:hover {
	color: ${colors.link_hover};
}

.friends-list {
	display: flex;
	max-width: 25%;
	min-width: 180px;
	margin-right: 20px;
	max-height: 90vh;
	color: ${colors.second_text};
}

.form-control {
	border: var(--bs-border-width) solid ${colors.toggle_deselected};
}

.no-friends-selected-msg, .no-friends-msg {
	color: ${colors.second_text};
}

	.no-content-container {
		position: relative;
		display: flex;
		width: 100%;
		height: 500px;
		flex-direction: column;
		max-height: 500px;
	}

	.no-content-img {
		position: absolute;
		width: 450px;
		height: auto;
		margin: 20px auto;
		opacity: 5%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.no-content-text {
		position: absolute;
		margin-top: 50px;
		font-size: 24px;
		left: 50%;
		transform: translate(-50%, 0);
		text-align: center;
		color: ${colors.second_text};
	}

.alert-div {
	display: flex;
	margin: 30px auto;
	width: 80%;
	animation: disappear linear 5s forwards;
	background-color: ${colors.alert};
	z-index: 1001;
}

.alert-bar {
	width: 95%;
	height: 5px;
	border-style: hidden;
	border-radius: 2px;
	background-color: ${colors.alert_bar};
	position: absolute;
	bottom: 2px;
	animation: expire linear 5s forwards;
}

@keyframes expire {
	from {
		width: 95%;
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
	<div class="chat">
		<div class="no-friends-msg hide">
			<span>${data.langDict.no_friends_msg}</span>
			<div><span class="link">${data.langDict.find_friends_msg}</span></div>
		</div>
		<div class="friends-list">
			<chat-friends-list language=${data.language}></chat-friends-list>
		</div>
		<div class="chat-area">
<<<<<<< HEAD
			<div class= "no-content-container">
				<img src="/img/pong-gs.png" class="no-content-img">
				<div class="no-content-text">You have no friend selected. Please select a friend to start a chat.</div>
			</div>
=======
			<div class="no-friends-selected-msg hide"><span>${data.langDict.no_friend_selected}</span></div>
>>>>>>> main
		</div>
	</div>
	`;
	return html;
}

export default class AppChat extends HTMLElement {
	static observedAttributes = ["language"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "language") {
			this.data.langDict = getLanguageDict(newValue, enAppChatDict, ptAppChatDict, esAppChatDict);
			this.data.language = newValue;
		}
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);

		this.chatSection = this.html.querySelector(".chat-area");
	}

	#scripts() {
		this.#setStateEvent();
		this.#setupFriendsPageRedirect();
		this.#addfriendChatIdStateEvent();
		this.#errorMsgEvents();
	}

	#setStateEvent() {
		stateManager.addEvent("friendChatId", (stateValue) => {
			if (stateValue) {
				this.#insertChatSection();
				chatWebSocket.connect(stateManager.getState("friendChatId"));
				chatWebSocket.getMessages(stateManager.getState("chatMessagesCounter"));
			}
		});
	}

	#insertChatSection() {
		const userData = stateManager.getState("chatUserData");
		this.chatSection.innerHTML = `
			<chat-section
				user-id="${userData.id}"
				username="${userData.username}"
				profile-photo="${userData.image}"
				online="${userData.online}"
				language="${this.data.language}"
			></chat-section>
		`;
	}

	#setupFriendsPageRedirect() {
		const link = this.html.querySelector(".link");
		if (!link)
			return ;
		link.addEventListener("click", () => {
			redirect("/friends");
		});
	}

	#addfriendChatIdStateEvent() {
		stateManager.addEvent("friendChatId", (state) => {
			if (!state) {
				this.chatSection.innerHTML = 
				`
				<div class= "no-content-container">
					<img src="/img/pong-gs.png" class="no-content-img">
					<div class="no-content-text">${this.data.langDict.no_friend_selected}</div>
				</div>
				`;
				stateManager.setState("errorMsg", `${this.data.langDict.error_msg}`);
			}
		});
	}

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				stateManager.setState("errorMsg", null);
				const mainDiv = this.html.querySelector(".chat-area");
				const alertBefore  = this.html.querySelector(".alert");
				if (!mainDiv)
					return ;
				if (alertBefore)
					alertBefore.remove();
				const insertElement = mainDiv.querySelector(".no-friends-selected-msg");
				if (!insertElement)
					return ;
				let alertCard = document.createElement("div");
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
}

customElements.define("app-chat", AppChat);
