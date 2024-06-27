import { callAPI } from "../utils/callApiUtils.js";

const styles = `
.friends-section {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 30px;
	padding: 0px 10px 0px 10px;
}

.lateral-menu {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.list-panel {
	width:100%;
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
}

.icon-text {
	font-size: 14px;
	white-space: nowrap;
}

.lateral-menu button > span {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 15px;
}

user-card {
	display: block;
	margin-bottom: 20px;
}

.options {
	padding: 5px 10px 5px 10px;
}

.options:hover {
	background-color: red;
	border-radius: 8px;
	padding: 5px 10px 5px 10px;
}

.search-icon {
	position: absolute;
	margin-top: 6px;
	margin-left: 15px;
	font-size: 16px;
}

.search-bar input {
	padding-left: 40px;
}

.search-bar {
	margin-bottom: 25px;
}

`;

const getHtml = function(data) {

	const html = `
		<div class="friends-section">
			<div class="lateral-menu">
				<div class="options">
					<button class="search-btn">
						<span>
							<i class="icon bi bi-search"></i>
							<span class="icon-text">Search</span>
						</span>
					</button>
				</div>
				<div class="options">
					<button class="friends-btn">
						<span>
							<i class="icon bi bi-people"></i>
							<span class="icon-text">All Friends</span>
						</span>
					</button>
				</div>
				<div class="options">
					<button class="requests-btn">
						<span>
							<i class="icon bi bi-person-plus"></i>
							<span class="icon-text">Requests</span>
						</span>
					</button>
				</div>
			</div>
			<div class="list-panel">
				<div class="search-bar">
					<div class="form-group">
						<i class="search-icon bi bi-search"></i>
						<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="50">
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
		//this.#getFriendsList();
		this.#getUsersList("users");
		this.#setSearchButtonEvent();
		this.#setFriendsButtonEvent();
		this.#setRequestsButtonEvent();
	}

	#getUsersList(listType, keyToSearch) {
		let queryParams = "";
		let path = null;
		if (keyToSearch)
			queryParams = `?key=${keyToSearch}`;
		if (listType == "friends")
			path = "/api/friends/search/";
		else if (listType == "users")
			path = "/api/friends/search_user_by_name/";
		//else 
		//	path = "/api/friends/friends/request/";

		callAPI("GET", `http://127.0.0.1:8000${path}${queryParams}`, null, (res, data) => {
			if (res.ok)
				this.#insertUsersCards(data.users, false);
		});
	}

	#insertUsersCards(userList, friend) {
		const userListHtml = this.html.querySelector(".user-list");
		let userCard = null;
		userList.forEach((elm) => {
			userCard = document.createElement("div");
			userCard.innerHTML = `
			<user-card
				profile-photo="${elm.image}"
				username="${elm.username}"
				friend="${friend}"
				user-id="${elm.id}"
				friend-request-sent="${elm.friend_request_sent}"
			></user-card>`;
			userListHtml.appendChild(userCard);
		});
	}
	
	#setSearchButtonEvent() {
		const btn = this.html.querySelector(".search-btn");
		btn.addEventListener("click", (event) => {
			
		});
	}

	#setFriendsButtonEvent() {
		const btn = this.html.querySelector(".friends-btn");
		btn.addEventListener("click", (event) => {
		});
	}

	#setRequestsButtonEvent() {
		const btn = this.html.querySelector(".requests-btn");
		btn.addEventListener("click", (event) => {
			this.#createRequestsPage();
		});
	}

	#insertUsersCards1(userList, page) {
		const userListHtml = this.html.querySelector(".user-list");
		let userCard = null;
		let requestId = 0;

		userList.forEach((elm) => {
			const cardButtons = this.#getButtonsForElement(elm, page);
			userCard = document.createElement("div");

			if (page == "request")
				requestId = elm["request_id"];
			
			userCard.innerHTML = `
			<user-card
				profile-photo="${elm.image}"
				username="${elm.username}"
				user-id="${elm.id}"
				request-id="${requestId}"
				friend-request-sent-btn="${cardButtons.friendRequestSentBtn}",
				friend-request-remove-btn="${cardButtons.friendRequestRemoveBtn}",
				friend-request-accept-btn="${cardButtons.friendRequestAcceptBtn}",
				friend-request-decline-btn="${cardButtons.friendRequestDeclineBtn}",
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
		}

		if (page == "requests") {
			cardButtons.friendRequestAcceptBtn = true;
			cardButtons.friendRequestDeclineBtn = true;
		}
		else if (page == "search") {
			cardButtons.friendRequestSentBtn = true;
			cardButtons.friendRequestRemoveBtn = true;
		}
		return cardButtons;
	}


	#createSearchPage() {
		
	}

	#createFriendsPage() {

	}

	#createRequestsPage() {
		const listPanel = this.html.querySelector(".list-panel");
		listPanel.innerHTML = `<div class="user-list"></div>`;

		callAPI("GET", `http://127.0.0.1:8000/api/friends/request/`, null, (res, data) => {
			if (res.ok)
				this.#insertUsersCards1(data.friend_requests, "requests");
		});
	}
}

customElements.define("app-friends", AppFriends);
