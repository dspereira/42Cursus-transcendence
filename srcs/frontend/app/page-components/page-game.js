import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";
import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js"

const styles = `
	.game-page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.create-enter-game, .invite-players {
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.create-enter-game {
		display: flex;
	}

	.invite-players {
		display: none;
	}

	.separator {
		display: flex;
		width: 50%;
		height: 5px;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
		margin: 20px 0px 20px 0px;
	}

	.create-btn {
		display: flex;
		width: 250px;
		height: 50px;
		justify-content: center;
		align-items: center;
	}

	.friend-invites {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
	}

	.invite-friends {
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
		align-items: flex-start;
		border-radius: 10px;
		font-size: 16px;
		font-weight: bold;
		gap: 60px;
	}

	.invite-card {
		display: flex;
		flex-direction: column;
		width: 150px;
		height: 200px;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
	}

	.invited-btn, .inv-decline-btn {
		display: flex;
		height: 60%;
		margin: 0px 20px 0px 20px;
		justify-content: center;
		align-items: center;
	}

	.invited-btn {
		width: 180px;
	}

	.inv-decline-btn {
		width: 60px;
	}	

	.invited-card {
		display: flex;
		flex-direction: row;
		width: 80%;
		height: 100px;
		border-radius: 20px;
		border-style: hidden;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.invited-card-p {
		display: flex;
		width: 200px;
		height: 100%;
		gap: 10px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.pfp-invitee {
		width: 60px;
		height: 60px;
	}

	.invite-btn {
		width: 80%;
		height: 15%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.create-btn, .invite-btn, .invited-btn, .back-btn, .inv-decline-btn {
		color: white;
		border-style: hidden;
		border-radius: 5px;
	}

	.username, .create-btn, .invite-btn, .back-btn, .invited-btn, .inv-decline-btn {
		font-size: 16px;
		font-weight: bold;
	}

	.back-btn {
		width: 100px;
		height: 50px;
		padding: 10px 20px;
		cursor: pointer;
		margin-right: 10px;
	}

	.inv-header {
		display: flex;
		width: 100%;
		justify-content: space-between;
		margin: 0px 0px 20px;
	}

	.inv-header-text {
		font-size: 24px;
		font-weight: bold;
	}

	.friend-search {
		width: 200px;
		height: 50px;
		color: #C2C2C2;
		text-align: center;
		border-style: hidden;
		border-radius: 5px;
	}

	.friend-search::placeholder {
		color: #C2C2C2;
	}

	.friend-search:focus {
		box-shadow: none;
		border: none;
		border-radius: 5px;
	}

	.friend-search:focus-visible {
		outline: 3px solid #C2C2C2;
	}

	.profile-photo {
		width: 120px;
		height: auto;
	}

	.profile-photo-status {
		position: relative;
	}

	.online-status {
		position: absolute;
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: green;
		z-index: 2;
		top: 100px;
		right: 2px;
		border: 2px solid white;
	}

	.hide {
		display: none;
	}

	.friend-box {
		display: flex;
		flex-direction: column;
		width: 150px;
		height: 200px;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
		margin: 10px;
	}

	.search {
		background-color: ${colors.main_card};
		margin-right: 40px;
		margin-bottom: 25px;
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
		color: ${colors.second_text};
	}

	.form-control + input:focus {
		color: ${colors.second_text};
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
		color:  ${colors.second_text};
	}

	.creation-bottom-bar {
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 0px;
		width: 100%;
		height: 100px;
	}

	.submit-button {
		display: flex;
		width: 180px;
		height: 60%;
		margin: 0px 20px 0px 20px;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 16px;
		font-weight: bold;
		border-style: hidden;
		border-radius: 5px;
	}

	.submit-button:disabled {
		background-color: #FFBAAB;
		cursor: not-allowed;
	}

	.invite-card, .invited-card, .friend-search, .box-off {
		background-color: ${colors.second_card};
	}

	.box-on .username {
		color: ${colors.primary_text};
	}

	.create-btn, .invite-btn, .invited-btn, .back-btn, .inv-decline-btn, .separator, .submit-button:not(disabled), .invite-card:hover {
		background-color: ${colors.input_background};
	}

	.invite-card:hover .invite-btn, .back-btn:hover, .inv-decline-btn:hover, .box-on, .submit-button:not(:disabled):hover, .create-btn:hover, .invite-btn:hover, .invited-btn:hover {
		background-color: ${colors.btn_default};
	}

	.invited-card, .inv-header-text, .username, .box-off .username, .invite-friends{
		color: ${colors.second_text};
	}

	.separator {
		background-color: ${colors.divider};
	}
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="game"></side-panel>
		<div class="content content-small">
			<div id="game" class="game-page">
				<div class="create-enter-game">
					<button type="button" class="create-btn">
						Create Game
					</button>
					<div class="separator"></div>
					<div class="friend-invites"></div>
				</div>
				<div class="invite-players">
					<div class="inv-header">
						<button type="button" class="back-btn">
							Back
						</button>
						<div class="inv-header-text">
							Invite a Friend For a Challenge!
						</div>
						<div class="form-group search">
							<i class="search-icon bi bi-search"></i>
							<input type="text" class="form-control form-control-sm" id="search" placeholder="Search..." maxlength="50">
						</div>
					</div>
					<div class="invite-friends"></div>
					<div class="creation-bottom-bar">
						<button class="submit-button">Invite</button>
					</div>
				</div>
			</div>
		</div>
	`;
	return html;
}

const title = "BlitzPong - Game";

export default class PageGame extends HTMLElement {
	static #componentName = "page-game";

	constructor() {
		super()
		this.friendBoxData = [];
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
		this.#search();
		const friendList = getFriendsFakeCall();
		adjustContent(this.html.querySelector(".content"));
		this.#showInvites(friendList);
		this.#searchFriends();
		this.html.querySelector(".create-btn").addEventListener("click", () => {
			this.#toggleInviteSection();
		});
		this.html.querySelector(".back-btn").addEventListener("click", () => {
			this.#toggleInviteSection();
		});
		this.#changeOnlineStatus();
	}

	#inviteFriends(friendList) {
		const inviteFriendsHtml = this.html.querySelector(".invite-friends");
		inviteFriendsHtml.innerHTML = "";
		if (!friendList)
		{
			inviteFriendsHtml.innerHTML = "<div>No friend that matches your search!</div>";
			return ;
		}
		friendList.forEach((friend) => {
			inviteFriendsHtml.appendChild(this.#createCheckbox(friend));
		});
	}

	#createCheckbox(friend) {
		if (friend) {
			const elm = document.createElement("div");
			let visibility = "hide";
			elm.classList.add("friend-box");
			elm.id = `id-${friend.id}`;
			if (this.friendBoxData && this.friendBoxData.indexOf(elm.id) != -1)
				elm.classList.add("box-on");
			else
				elm.classList.add("box-off");
			const submitBtn = document.querySelector(".submit-button");
			if (friend.online)
				visibility = "";
			console.log(friend.username, " status", friend.online ? "online" : "offline");
			submitBtn.disabled = this.friendBoxData.length < 1;
			if (friend) {
				elm.innerHTML = `
					<div class="profile-photo-status">
						<img src="${friend.image}" class="profile-photo"/>
						<div class="online-status ${visibility}"></div>
					</div>
					<span class="username">${friend.username}</span>
				`;
			}
			elm.addEventListener("click", () => {
				const inArray = this.friendBoxData.indexOf(elm.id);
				console.log("toggle = ", inArray);
				console.log("length = ", this.friendBoxData.length);
				if (inArray != -1) {
					elm.classList.remove("box-on");
					elm.classList.add("box-off");
					this.friendBoxData.splice(inArray, 1);
				}
				else {
					elm.classList.add("box-on");
					this.friendBoxData.push(elm.id);
					elm.classList.remove("box-off");
				}
				if ((this.friendBoxData.length == 3))
					console.log("enabled!");
				else
					console.log("disabled");
				submitBtn.disabled = this.friendBoxData.length < 1;
				console.log(this.friendBoxData);
			});
			return elm;
		}
	}

	#toggleInviteSection() {
		const createEnterSection = this.html.querySelector(".create-enter-game");
		const invitePlayersSection = this.html.querySelector(".invite-players");

		if (createEnterSection.style.display === "none") {
			createEnterSection.style.display = "flex";
			invitePlayersSection.style.display = "none";
		} else {
			createEnterSection.style.display = "none";
			invitePlayersSection.style.display = "flex";
		}
	}

	#showInvites(friendInvites) {
		const friendInvitesHtml = this.html.querySelector(".friend-invites");
		friendInvites.forEach((invite) => {
			friendInvitesHtml.appendChild(this.#getInviteHtml(invite));
		});
	}

	#getInviteHtml(invite) {
		const elm = document.createElement("div");
		elm.classList.add("invited-card");
		elm.id = `id-${invite.id}`;
		if (invite) {
			elm.innerHTML = `
				<button class="invited-btn">Join</button>
				<div class=invited-card-p>
					<img src="${invite.image}" class="pfp-invitee"/>
					<span class="username">${invite.username}</span>
				</div>
				<div>TIME <br> ELAPSED</div>
				<button class="inv-decline-btn">X</button>
			`;
		}
		return elm;
	}

	#searchFriends() {
		const inp = this.html.querySelector(".search input");
		if (!inp)
			return ;
		inp.addEventListener("input", event => this.#search(inp.value));
	}

	#search(value) {
		const userList = this.html.querySelector(".user-list");
		let path = "/api/friends/friendships/";
		let key;
		if (value)
			key = `?key=${value}`;
		else
			key = "";
		console.log(key);
		callAPI("GET", `http://127.0.0.1:8000${path}${key}`, null, (res, data) => {
			if (res.ok) {
				console.log(data);
				this.#inviteFriends(data.friends);
			}
		});
	}

	#changeOnlineStatus() {
		stateManager.addEvent("onlineStatus", (value) => {
			this.#updateUserOnlineStatusHtml(value);
		});
	}

	#updateUserOnlineStatusHtml(value) {
		if (!value)
			return ;

		let friendHtml = this.html.querySelector(".invite-friends").querySelector(`#id-${value.id}`);
		if (friendHtml)
			this.#changeOnlineStatusFriendHtml(friendHtml, value.online);
		// friendHtml = this.html.querySelector(`#id_${value.id}`);
		// if (friendHtml)
		// 	this.#changeOnlineStatusFriendHtml(friendHtml, value.online);
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
}

customElements.define(PageGame.componentName, PageGame);

// Just for debug
const getFriendsFakeCall = function () {
	const data = `[
		{
			"id": 1,
			"username": "admin",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=admin"
		},
		{
			"id": 2,
			"username": "diogo",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=diogo"
		},
		{
			"id": 3,
			"username": "irineu",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=irineu"
		},
		{
			"id": 4,
			"username": "irineu2",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=irineu2"
		},
		{
			"id": 5,
			"username": "john",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=john"
		},
		{
			"id": 6,
			"username": "jane",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=jane"
		},
		{
			"id": 7,
			"username": "alice",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=alice"
		},
		{
			"id": 8,
			"username": "bob",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=bob"
		},
		{
			"id": 9,
			"username": "charlie",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=charlie"
		},
		{
			"id": 10,
			"username": "dave",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=dave"
		},
		{
			"id": 11,
			"username": "eve",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=eve"
		}
	]`;

	return JSON.parse(data);
}