import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { enAppChatDict } from "../lang-dicts/enLangDict.js";
import { ptAppChatDict } from "../lang-dicts/ptLangDict.js";
import { esAppChatDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
.chat {
	display: flex;
}

.chat-area {
	width: 100%;
}

.hide {
	display: none;
}

.link {
	color: blue;
	text-decoration: underline;
	cursor: pointer;
}

.link:hover {
	color: darkblue;
}

.friends-list {
	width: 25%;
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
			<div class="no-friends-selected-msg hide"><span>${data.langDict.no_friend_selected}</span></div>
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
				this.chatSection.innerHTML = `
				<div class="no-friends-selected-msg">
					<span>You have no friend selected. Please select a friend to start a chat.</span>
				</div>`;
			}
		});
	}
}

customElements.define("app-chat", AppChat);
