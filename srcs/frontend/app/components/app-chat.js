import chatWebSocket from "../js/ChatWebSocket.js";
import stateManager from "../js/StateManager.js";

const styles = `
.chat {
	display: flex;
}

.chat-area {
	width: 100%;
}

`;

const getHtml = function(data) {
	const html = `
	<div class="chat">
		<div class="friends-list">
			<chat-friends-list></chat-friends-list>
		</div>
		<div class="chat-area">
			<!--<chat-section></chat-section>-->
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
	}

	#setStateEvent() {
		stateManager.addEvent("friendChatId", (stateValue) => {
			console.log(`friendChatId: ${stateValue}`);

			if (stateValue) {
				this.#insertChatSection();
				chatWebSocket.connect(stateManager.getState("friendChatId"));
				chatWebSocket.get_messages(stateManager.getState("chatMessagesCounter"));
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
				id="${userData.id}"
				username="${userData.username}"
				profile-photo="${userData.image}"
			></chat-section>
		`;
	}
}

customElements.define("app-chat", AppChat);
