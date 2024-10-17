import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js"
import { chatColors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { enChatFriendListDict } from "../lang-dicts/enLangDict.js";
import { ptChatFriendListDict } from "../lang-dicts/ptLangDict.js";
import { esChatFriendListDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";
import { pfpStyle } from "../utils/stylingFunctions.js";

const styles = `
.friend-list {
	margin-right: 0px;
	max-height: 80vh;
}

.friend-list::-webkit-scrollbar {
	width: 15px;
}

.friend-list::-webkit-scrollbar-track {
	width: 15px;
	background: ${colors.second_card};
}

.friend-list::-webkit-scrollbar-thumb {
	background: ${colors.main_card};
	border-radius: 10px;
	border-style: hidden;
	border: 3px solid transparent;
	background-clip: content-box;
}

.scroll::-webkit-scrollbar-thumb:hover {
	background: ${colors.main_card};
}

.search-list {
	margin-right: 25px;
	max-height: 87vh;
}

.user {
	display: flex;
	cursor: pointer;
	align-items: center;
	gap: 10px;
	margin: 0px 5px 20px 5px;
	padding: 5px 10px 5px 10px;
}

${pfpStyle(".user .profile-photo", "45px")}

.user .name {
	font-size: 16px;
	font-weight: bold;
}

.user:hover {
	background-color: ${colors.btn_hover};
	color: ${colors.second_text};
	border-radius: 8px;
}

.friend-selected {
	background-color: ${colors.btn_default};
	border-style: hidden;
	color: ${colors.primary_text};
	border-radius: 5px;
}

.scroll {
	overflow-y: auto;
}

.search-container {
	display: flex;
	justify-content: center;
}

.search {
	background-color: ${colors.second_card};
	width: 90%;
	align-items: center;
	margin-right: 0px;
	margin-top: 10px;
	margin-bottom: 25px;
}


.form-control {
	border-radius: 5px;
	border-style: hidden;
	background-color: ${colors.input_background};
}

.form-control::placeholder {
	color: ${colors.second_text};
}

.form-control:focus {
	background-color: ${colors.input_background};
	color: ${colors.second_text};
}

.search-icon {
	position: absolute;
	margin-top: 3px;
	margin-left: 8px;
	font-size: 16px;
	color: ${colors.second_text};
}

.search input {
	padding-left: 30px;
	color:  ${colors.second_text};
}

.form-control + input:focus {
	color:  ${colors.second_text};
}


.search-bar {
	margin-bottom: 25px;
}

.hide {
	display: none;
}

.back {
	background-color: red;
}

.online-status {
	position: absolute;
	display: inline-block;
	width: 13px;
	height: 13px;
	border-radius: 50%;
	background-color: green;
	z-index: 2;
	top: 33px;
	right: 2px;
	border: 2px solid white;
}

.profile-photo-status {
	position: relative;
}

.hide {
	display: none;
}

.list-container {
	display: flex;
	flex-direction: column;
		min-width: 200px;
	border-radius: 10px;
	border-style: hidden;
	background-color: ${colors.second_card};
	padding-bottom: 10px;
}

`;

const getHtml = function(data) {
	const html = `
		<div class="list-container">
			<div class="search-container">
				<div class="form-group search">
					<i class="search-icon bi bi-search"></i>
					<input type="text" class="form-control form-control-sm" id="search" placeholder="${data.langDict.search_bar_placeholder_search}" maxlength="15">
				</div>
			</div>
			<div class="search-list scroll hide"></div>
			<div class="friend-list scroll"></div>
		</div>
	`;
	return html;
}

export default class ChatFriendsList extends HTMLElement {
	static observedAttributes = ["language"];

	constructor() {
		super()
		this.friendListData = null;
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "language") {
			this.data.langDict = getLanguageDict(newValue, enChatFriendListDict, ptChatFriendListDict, esChatFriendListDict);
			this.data.language = newValue;
		}
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);

		this.friendListHtml = this.html.querySelector(".friend-list");
		this.searchListHtml = this.html.querySelector(".search-list");
	}

	#scripts() {
		this.#getChatFriendListToApi();
		this.#pushFriendToTopOnMessage();
		this.#setSearchEvent();
		this.#changeOnlineStatus();
		this.#removeFriendFromChatEvent();
	}

	#getChatFriendListToApi() {
		callAPI("GET", `/friends/chat-list/`, null, (res, data) => {
			if (res.ok) {
				if (data.friends) {
					this.friendListData = data.friends;
					data.friends.forEach(elm => {
						this.#insertFriendToList(elm, "friend");
					});
					this.#showNoFriendMsg("no-friends-selected-msg");
					this.#selectPreviousFriend();
				}
				else
					this.#showNoFriendMsg("no-friends-msg");
			}
		});
	}

	#insertFriendToList(friendObj, list) {
		const friendHtml = document.createElement("div");
		let visibility = "hide";

		if (list == "friend")
			friendHtml.id = `id-${friendObj.id}`;
		else
			friendHtml.id = `id_${friendObj.id}`;

		friendHtml.classList.add("user");
		if (friendObj.online)
			visibility = "";

		friendHtml.innerHTML = `
		<div class="profile-photo-status">
			<img src="${friendObj.image}" class="profile-photo" alt="profile photo chat">
			<div class="online-status ${visibility}"></div>
		</div>
		<span class="name">${friendObj.username}</span>`;
		this.#appendChildToList(friendHtml, list);
		this.#setFriendClickEventHandler(friendHtml, list);
	}

	#setFriendClickEventHandler(friend, listName) {
		friend.addEventListener("click", () => {
			this.#removeAllSelectedFriends();
			const friendId = friend.id.substring(3);
			friend.disable = true;
			this.#isFriend(friendId, (status) => {
				if (status)
					this.#selectFriendToChat(friend, friendId, listName);
				else
					this.#removeFriendFromChat(friendId);
				friend.disable = false;
			});
		});
	}

	#appendChildToList(elm, listName) {
		if (listName == "friend")
			this.friendListHtml.appendChild(elm);
		else
			this.searchListHtml.appendChild(elm);
	}

	#selectFriendToChat(friendElm, friendId, listName) {
		this.#removeAllSelectedFriends();
		
		let data;
		if (listName == "search")
			data = this.searchListData.find(user => user.id == friendId);
		else
			data = this.friendListData.find(user => user.id == friendId);
		if (data)
			stateManager.setState("chatUserData", data);
		if (stateManager.getState("friendChatId") != friendId)
			stateManager.setState("friendChatId", friendId);
		friendElm.classList.add("friend-selected");
		if (listName == "search")
			this.#selectFriendFromFriendList(friendId);
	}

	#selectFriendFromFriendList(id) {
		let elmId = `#id-${id}`;

		const friendElm = this.html.querySelector(elmId);
		if (!friendElm)
			return ;
		friendElm.classList.add("friend-selected");
	}

	#removeFriendFromList(list, friendId) {
		if (!list || !friendId)
			return ;
		let idx = list.findIndex(user => user.id == friendId);
		if (idx >= 0)
			list.splice(idx, 1);
	}

	#removeFriendFromChat(friendId) {
		this.#removeFriendFromList(this.friendListData, friendId);
		this.#removeFriendFromList(this.searchListData, friendId);

		let elm = this.html.querySelector(`#id-${friendId}`);
		if (elm)
			elm.remove();
		elm = this.html.querySelector(`#id_${friendId}`);
		if (elm)
			elm.remove();

		if (stateManager.getState("friendChatId") == friendId)
			stateManager.setState("friendChatId", null);
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

	#selectPreviousFriend() {
		const friendId = stateManager.getState("friendChatId");
		if (!friendId)
			return ;
		const data = this.friendListData.find(user => user.id == friendId);
		const elm = this.html.querySelector(`#id-${friendId}`);

		if (!elm || !data) {
			stateManager.setState("friendChatId", null);
			stateManager.setState("chatUserData", null);
			return ;
		}
		elm.classList.add("friend-selected");
		stateManager.setState("chatUserData", data);
		stateManager.setState("friendChatId", friendId);
	}


	#pushFriendToTopOnMessage() {
		stateManager.addEvent("messageSend", (stateValue) => {
			if (stateValue) {
				this.#restoreFriendsList();
				const friendList = this.html.querySelector(".friend-list");
				const firstFriend = this.html.querySelector(".friend-list .user");
				const friendSelected = this.html.querySelector(".friend-selected");
				if (!friendSelected || !firstFriend)
					return ;
				if (firstFriend != friendSelected) {
					friendList.insertBefore(friendSelected, firstFriend);
					const scroll = this.html.querySelector(".friend-list.scroll");
					if (scroll)
						scroll.scrollTop = 0;
				}
			}
		})
	}

	#searchFriends(value) {
		if (!value) {
			this.#restoreFriendsList();
			return ;
		}
		callAPI("GET", `/friends/friendships/?key=${value}`, null, (res, data) => {
			if (res.ok) {
				this.searchListHtml.innerHTML = "";
				this.#friendsListVisibility("hide");
				this.#searchListVisibility("show");
				this.searchListData = data.friends;
				if (data.friends) {
					data.friends.forEach(elm => {
						this.#insertFriendToList(elm, "search");
					});
				}
			}
		});
	}

	#setSearchEvent() {
		const search = this.html.querySelector(".search input");
		if (search)
			search.addEventListener("input", event => this.#searchFriends(search.value));
	}

	#friendsListVisibility(type) {
		if (this.friendListHtml && type == "hide") {
			this.friendListHtml.classList.add("hide");
		}
		else if (this.friendListHtml && type == "show")
			this.friendListHtml.classList.remove("hide");
	}

	#searchListVisibility(type) {
		if (this.searchListHtml && type == "hide")
			this.searchListHtml.classList.add("hide");
		else if (this.searchListHtml && type == "show")
			this.searchListHtml.classList.remove("hide");
	}

	#restoreFriendsList() {
		const search = this.html.querySelector(".search input");
		if (search)
			search.value = "";
		this.#friendsListVisibility("show");
		this.#searchListVisibility("hide");
		this.searchListHtml.innerHTML = "";
	}

	#changeOnlineStatus() {
		stateManager.addEvent("onlineStatus", (value) => {
			this.#updateUserOnlineStatusHtml(value);
			this.#updateOnlineStatusFriendListData(value);
		});
	}

	#updateUserOnlineStatusHtml(value) {
		if (!value)
			return ;

		let friendHtml = this.html.querySelector(`#id-${value.id}`);
		if (friendHtml)
			this.#changeOnlineStatusFriendHtml(friendHtml, value.online);

		friendHtml = this.html.querySelector(`#id_${value.id}`);
		if (friendHtml)
			this.#changeOnlineStatusFriendHtml(friendHtml, value.online);
	}
		
	#changeOnlineStatusFriendHtml(friendHtml, onlineStatus) {
		const onlineIcon = friendHtml.querySelector(".online-status");
		if (!onlineIcon)
			return ;
		if (onlineStatus)
			onlineIcon.classList.remove("hide");
		else
			onlineIcon.classList.add("hide");
	}

	#updateOnlineStatusFriendListData(value) {
		let data = this.friendListData.find(user => user.id == value.id);
		if (data)
			data.online = value.online;
	}

	#isFriend(friendId, callback) {
		callAPI("GET", `/friends/is-friend/?friend_id=${friendId}`, null, (res, data) => {
			if (res.ok && data)
				callback(data.friend_status)
		});
	}

	#removeFriendFromChatEvent() {
		stateManager.addEvent("removeFriendIdFromChat", (status) => {
			if (status) {
				const friendId = status;
				const friend = this.html.querySelector(`#id-${friendId}`);
				this.#removeFriendFromChat(friendId);
				stateManager.setState("removeFriendIdFromChat", null);
			}
		});
	}
}

customElements.define("chat-friends-list", ChatFriendsList);
