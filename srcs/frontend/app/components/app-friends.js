import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import {colors} from "../js/globalStyles.js"
import stateManager from "../js/StateManager.js";

const styles = `
.friends-section {
	min-width: 460px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 20px;
	max-height: 90vh;
}

.lateral-menu {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	min-width: 180px;
	width: 10%;
	border-radius: 5px;
	border-style: hidden;
	background-color: ${colors.second_card};
	padding: 10px 10px 10px 10px;
}

.list-panel {
	color: ${colors.second_text};
	width: 100%;
	display: flex;
	flex-direction: column;
}

.lateral-menu button {
	display: block;
	background : transparent;
	border: 0;
	padding: 0;
	font-family: innherit;
	text-align: left;
	width: 100%;
	/*margin-bottom: 16px;*/
}

.icon {
	font-size: 22px;
	color: ${colors.primary_text};
}

.icon-text {
	font-size: 14px;
	white-space: nowrap;
	color: ${colors.primary_text};
}

.lateral-menu button > span {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 15px;
}

user-card {
	display: block;
}

.user-card {
	background-color: ${colors.second_card};
	color: ${colors.second_text};
}

.options {
	padding: 5px 10px 5px 10px;
}

.options:hover {
	background-color: ${colors.button_background};
	border-radius: 8px;
	padding: 5px 10px 5px 10px;
}

.search-icon {
	position: absolute;
	margin-top: 6px;
	margin-left: 15px;
	font-size: 16px;
	color: ${colors.second_text};
}

.search-bar input, .search-bar input:hover, .search-bar input:focus{
	padding-left: 40px;
	color:  ${colors.second_text};
}

.search-bar {
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
}


.selected-option {
	background-color: ${colors.btn_default};
	border-style: hidden;
	border-radius: 5px;
	transition: 0.5s;
}

.alert-div {
	display: flex;
	width: 100%;
	animation: disappear linear 10s forwards;
	background-color: ${colors.alert};
}

.alert-bar {
	width: 100%;
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
		width: 100%;
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

.user-list {
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	gap: 20px;
	overflow-y: auto;
}

.notification {	
	background: red;
	border-radius: 50%;
	padding: 7px 7px;
}

.hide {
	display: none;
}

.notification {
	background: red;
	border-radius: 50%;
	padding: 7px 7px;
}

.hide {
	display: none;
}

`;

const getHtml = function(data) {

	const html = `
		<div class="friends-section">
			<div class="lateral-menu">
				<div class="options search">
					<button class="search-btn">
						<span>
							<i class="icon bi bi-search"></i>
							<span class="icon-text">Search</span>
						</span>
					</button>
				</div>
				<div class="options friends">
					<button class="friends-btn">
						<span>
							<i class="icon bi bi-people"></i>
							<span class="icon-text">All Friends</span>
						</span>
					</button>
				</div>
				<div class="options requests">
					<button class="requests-btn">
						<span>
							<i class="icon bi bi-person-plus"></i>
							<span class="icon-text">Requests</span>
							<span class="notification hide"></span>
						</span>
					</button>
				</div>
			</div>
			<div class="list-panel">
				<div class="search-bar">
					<div class="form-group">
						<i class="search-icon bi bi-search"></i>
						<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="15">
					</div>
				</div>
				<div class="user-list"></div>
			</div>
		</div>
	`;
	return html;
}

export default class AppFriends extends HTMLElement {
	static observedAttributes = [];

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

	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);

			this.notificationDot = this.html.querySelector(".notification");
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
		this.#createSearchPage();
		this.#setSearchButtonEvent();
		this.#setFriendsButtonEvent();
		this.#setRequestsButtonEvent();
		this.#errorMsgEvents();
		this.#notificationEvent();
		this.#updateNotificationStyle(stateManager.getState("hasFriendInvite"));
	}

	#updateNotificationStyle(state) {
		if (state)
			this.notificationDot.classList.remove("hide");
		else
			this.notificationDot.classList.add("hide");
	}

	#notificationEvent() {
		stateManager.addEvent("hasFriendInvite", (status) => {
			this.#updateNotificationStyle(status);
		});
	}

	#setSearchButtonEvent() {
		const btn = this.html.querySelector(".search-btn");
		btn.addEventListener("click", (event) => {
			this.#createSearchPage();
		});
	}

	#setFriendsButtonEvent() {
		const btn = this.html.querySelector(".friends-btn");
		btn.addEventListener("click", (event) => {
			this.#createFriendsPage();
		});
	}

	#setRequestsButtonEvent() {
		const btn = this.html.querySelector(".requests-btn");
		btn.addEventListener("click", (event) => {
			this.#createRequestsPage();
		});
	}

	#insertUsersCards(userList, page) {
		const userListHtml = this.html.querySelector(".user-list");
		let userCard = null;
		let cardButtons = null;
		let requestId = 0;

		if (!userList || userList.length == 0)
			return ;

		userListHtml.innerHTML = "";
		userList.forEach((elm) => {
			cardButtons = this.#getButtonsForElement(elm, page);
			userCard = document.createElement("div");
			requestId = 0;

			if (elm["request_id"])
				requestId = elm["request_id"];

			userCard.innerHTML = `
			<user-card
				profile-photo="${elm.image}"
				username="${elm.username}"
				user-id="${elm.id}"
				request-id="${requestId}"
				friend-request-sent-btn="${cardButtons.friendRequestSentBtn}"
				friend-request-remove-btn="${cardButtons.friendRequestRemoveBtn}"
				friend-request-accept-btn="${cardButtons.friendRequestAcceptBtn}"
				friend-request-decline-btn="${cardButtons.friendRequestDeclineBtn}"
				chat-btn="${cardButtons.chatBtn}"
				play-btn="${cardButtons.playBtn}"
				remove-friend-btn="${cardButtons.removeFriendBtn}"
			></user-card>`;
			userListHtml.appendChild(userCard);
		});
	}

	#getButtonsForElement(elm, page) {
		const cardButtons = {
			friendRequestSentBtn: false,
			friendRequestRemoveBtn: false,
			friendRequestAcceptBtn: false,
			friendRequestDeclineBtn: false,
			chatBtn: false,
			playBtn: false,
			removeFriendBtn: false
		}

		if (page == "requests") {
			cardButtons.friendRequestAcceptBtn = true;
			cardButtons.friendRequestDeclineBtn = true;
		}
		else if (page == "search") {
			if (elm.friend_request_sent)
				cardButtons.friendRequestRemoveBtn = true;
			else
				cardButtons.friendRequestSentBtn = true;
		}
		else if (page == "friends") {
			cardButtons.chatBtn = true;
			cardButtons.playBtn = true;
			cardButtons.removeFriendBtn = true;
		}
		return cardButtons;
	}

	#createSearchPage() {
		const listPanel = this.html.querySelector(".list-panel");
		listPanel.innerHTML = "";	
		this.#addSearchBar(listPanel, "search");
		this.#addUserList(listPanel);

		this.#setOptionSelected("search");
		callAPI("GET", `http://127.0.0.1:8000/api/friends/search_user_by_name/`, null, (res, data) => {
			if (res.ok)
				if (data.users)
					this.#insertUsersCards(data.users, "search");
				else
					listPanel.innerHTML = "<h1>There are no users to search for!</h1>";
		});
	}

	#createFriendsPage() {
		const listPanel = this.html.querySelector(".list-panel");
		listPanel.innerHTML = "";	
		this.#addSearchBar(listPanel, "friends");
		this.#addUserList(listPanel);

		this.#setOptionSelected("friends");
		callAPI("GET", `http://127.0.0.1:8000/api/friends/friendships/`, null, (res, data) => {
			if (res.ok) {
				if (data.friends)
					this.#insertUsersCards(data.friends, "friends");
				else
					listPanel.innerHTML = "<h1>Add friends to see them here!</h1>";
			}
		});	
	}

	#createRequestsPage() {
		const listPanel = this.html.querySelector(".list-panel");
		listPanel.innerHTML = "";
		this.#addUserList(listPanel);

		this.#setOptionSelected("requests");
		callAPI("GET", `http://127.0.0.1:8000/api/friends/request/`, null, (res, data) => {
			if (res.ok) {
				if (data.friend_requests)
					this.#insertUsersCards(data.friend_requests, "requests");
				else 
					listPanel.innerHTML = "<h1>Your friend requests list is empty. Make the first move</h1>";
			}
		});
	}

	#setOptionSelected(option) {
		const options = this.html.querySelectorAll(".options");

		if (!options)
			return ;
		options.forEach((elm) => {
			if (elm.classList.contains(option))
				elm.classList.add("selected-option");
			else
				elm.classList.remove("selected-option");
		});
	}

	#addSearchBar(elm, type) {
		const searchBar = document.createElement("div");
		searchBar.classList.add("search-bar");

		let placeholder = "";
		if (type == "friends")
			placeholder = "Search friends...";
		if (type == "search")
			placeholder = "Search...";

		searchBar.innerHTML = `
		<div class="form-group">
			<i class="search-icon bi bi-search"></i>
			<input type="text" class="form-control form-control-md" id="search" placeholder="${placeholder}" maxlength="15">
		</div>`;

		const inp = searchBar.querySelector("input");
		if (!inp)
			return ;

		inp.addEventListener("input", event => this.#search(type, inp.value));
		elm.appendChild(searchBar);
	}

	#addUserList(elm) {
		const userList = document.createElement("div");
		userList.classList.add("user-list");
		elm.appendChild(userList);
	}

	#search(type, value) {
		const userList = this.html.querySelector(".user-list");
		let path = "";

		if (type=="search")
			path = "/api/friends/search_user_by_name/";
		else
			path = "/api/friends/friendships/";

		callAPI("GET", `http://127.0.0.1:8000${path}?key=${value}`, null, (res, data) => {
			if (res.ok) {
				if (type=="search" && data.users)
					this.#insertUsersCards(data.users, "search");
				else if (type=="friends" && data.friends)
					this.#insertUsersCards(data.friends, "friends");
				else
					userList.innerHTML = "<h1>Username not Found!</h1>";
			}
		});
	}

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				console.log(msg);
				stateManager.setState("errorMsg", null);
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = this.html.querySelector(".friends-section");
				var alertCard = document.createElement("div");
				alertCard.className = "alert alert-danger hide from alert-div";
				alertCard.role = "alert";
				alertCard.innerHTML = `
						${msg}
						<div class=alert-bar></div>
					`;
				this.html.insertBefore(alertCard, insertElement);
			}
		});
	}
}

customElements.define("app-friends", AppFriends);
