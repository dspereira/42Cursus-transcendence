import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";
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
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "language") {
			this.data.langDict = getLanguageDict(newValue, enAppChatDict, ptAppChatDict, esAppChatDict);
			this.data.language = newValue;
		}
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
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
	}

	#scripts() {
		this.#setStateEvent();
		this.#setupFriendsPageRedirect();
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
		const chatSection = this.html.querySelector(".chat-area");
		const userData = stateManager.getState("chatUserData");

		if (!chatSection)
			return ;

		chatSection.innerHTML = `
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
}

customElements.define("app-chat", AppChat);
