import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";
import { colors } from "../js/globalStyles.js";

const styles = `
.chat {
	display: flex;
}

.chat-area {
	width: 100%;
	text-align: center;
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
	padding: 10px;
	max-width: 25%;
	min-width: 180px;
	margin-right: 20px;
	color: ${colors.second_text};
	background-color: ${colors.main_card};
	border-radius: 10px;
	border-style: hidden;
}

.form-control {
	border: var(--bs-border-width) solid ${colors.toggle_deselected};
}

.no-friends-selected-msg, .no-friends-msg {
	color: ${colors.second_text};
}
`;

const getHtml = function(data) {
	const html = `
	<div class="chat">
		<div class="no-friends-msg hide">
			<span>You have no friends! Please search for friends here to start a chat!</span>
			<div><span class="link">Find friends to chat here</span></div>
		</div>	
		<div class="friends-list">
			<chat-friends-list></chat-friends-list>
		</div>
		<div class="chat-area">
			<div class="no-friends-selected-msg hide"><span>You have no friends selected. Please select a friend to start a chat.</span></div>
		</div>
	</div>
	`;
	return html;
}

export default class AppChat extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

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
