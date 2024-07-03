import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `
.friend-list {
	margin-right: 25px;
}

.user {
	display: flex;
	cursor: pointer;
	align-items: center;
	gap: 10px;
	margin-bottom: 20px;
	padding: 5px 10px 5px 10px;
}

.user .profile-photo {
	width: 45px;
	height: auto;
	clip-path:circle();
}

.user .name {
	font-size: 16px;
	font-weight: bold;
}

.user:hover {
	background-color: #4287f5;
	border-radius: 8px;
}

.friend-selected {
	background-color: #4287f5;
	border-radius: 8px;
}

`;

const getHtml = function(data) {
	const html = `
		<div class="friend-list"></div>
	`;
	return html;
}

export default class ChatFriendsList extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.friendListData = null;
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
		this.friendListHtml = this.html.querySelector(".friend-list");
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
		this.#getChatFriendListToApi();
	}

	#getChatFriendListToApi() {
		callAPI("GET", `http://127.0.0.1:8000/api/friends/friendships/`, null, (res, data) => {
			if (res.ok) {
				if (data.friends) {
					this.friendListData = data.friends;
					data.friends.forEach(elm => {
						this.#insertFriendToList(elm);
						//this.#setFriendClickEventHandler1(elm);
					});
					this.#setFriendClickEventHandler();
					this.#showNoFriendMsg("no-friends-selected-msg");
				}
				else
					this.#showNoFriendMsg("no-friends-msg");
			}
		});        
	}

	#insertFriendToList(friendObj) {
		const friendHtml = document.createElement("div");
		
		friendHtml.id = `id-${friendObj.id}`;
		friendHtml.classList.add("user");
		friendHtml.innerHTML = `
		<img src="${friendObj.image}" class="profile-photo" alt="profile photo chat">
		<span class="name">${friendObj.username}</span>`;
		this.friendListHtml.appendChild(friendHtml);
		this.#setFriendClickEventHandler1(friendHtml);
	}

	#setFriendClickEventHandler() {
		const friends = this.html.querySelectorAll(".user");

		friends.forEach((elm) => {
			elm.addEventListener("click", () => {
				this.#removeAllSelectedFriends(friends);
				const id = elm.id.substring(3);

				if (!stateManager.getState("chatUserData") || stateManager.getState("chatUserData").id != id) {
					const data = this.friendListData.find(user => user.id == id);
					if (data)
						stateManager.setState("chatUserData", data);
				}
				if (stateManager.getState("friendChatId") != id) {
					stateManager.setState("friendChatId", id);
				}
				elm.classList.add("friend-selected");
			});
		});
	}

	#setFriendClickEventHandler1(friend) {
		friend.addEventListener("click", () => {
			this.#removeAllSelectedFriends();
			const id = friend.id.substring(3);

			if (!stateManager.getState("chatUserData") || stateManager.getState("chatUserData").id != id) {
				const data = this.friendListData.find(user => user.id == id);
				if (data)
					stateManager.setState("chatUserData", data);
			}
			if (stateManager.getState("friendChatId") != id) {
				stateManager.setState("friendChatId", id);
			}
			elm.classList.add("friend-selected");
		});
	}

	#removeAllSelectedFriends() {
		const friends = this.html.querySelectorAll(".user");
		if (!friends)
			return ;
		friends.forEach((elm) => {
			elm.classList.remove("friend-selected");
		});
	}

	#showNoFriendMsg(className) {
		const elm = document.querySelector(`.${className}`);
		if (elm)
			 elm.classList.remove("hide");
	}

}

customElements.define("chat-friends-list", ChatFriendsList);
