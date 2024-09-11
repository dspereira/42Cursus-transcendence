import {redirect} from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import {colors} from "../js/globalStyles.js";

const styles = `

	.creation-top-bar, .creation-bottom-bar {
		display: flex;
		width: 100%;
		height: 100px;
	}

	.creation-top-bar {
		justify-content: space-between;
	}

	.creation-bottom-bar {
		justify-content: center;
		position: fixed;
		bottom: 0;
	}

	.friend-selection {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		flex-grow: 1;
		margin-top: 20px;
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

	.username {
		font-size: 16px;
		font-weight: bold;
	}

	.tournament-name {
		width: 400px;
	}

	.submit-button {
		display: flex;
		width: 180px;
		height: 60%;
		margin: 0px 20px 0px 20px;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		font-weight: bold;
		border-style: hidden;
		border-radius: 5px;
	}

	.submit-button:disabled {
		background-color: #FFBAAB;
		cursor: not-allowed;
	}

	.search {
		background-color: ${colors.main_card};
	}

	.search-icon {
		position: absolute;
		margin-top: 6px;
		margin-left: 15px;
		font-size: 16px;
		color: ${colors.second_text};
	}

	.form-control {
		border-radius: 5px;
		border-style: hidden;
		background-color: ${colors.input_background};
		color: ${colors.second_text};
	}

	.form-control::placeholder {
		color: ${colors.second_text};
	}

	.form-control:focus {
		background-color: ${colors.input_background};
		color:  ${colors.second_text};
	}

	.search input {
		color:  ${colors.second_text};
	}

	.form-control + input:focus {
		color:  ${colors.second_text};
	}


	.search-bar input {
		padding-left: 40px;
	}

	.search-bar {
		margin-bottom: 25px;
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

	.create-btn {
		display: flex;
		width: 250px;
		height: 50px;
		justify-content: center;
		align-items: center;
	}

	.back-btn {
		width: 100px;
		height: 50px;
		padding: 10px 20px;
		cursor: pointer;
		margin-right: 10px;
	}

	.create-btn, .back-btn {
		color: white;
		border-style: hidden;
		border-radius: 5px;
		font-size: 16px;
		font-weight: bold;
	}

	.hide {
		display: none;
	}

	.create-join-tournament, .tournament-creation {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
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

	.friend-invites {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
	}

	.inv-bot {
		display: flex;
		width: 100%;
		height: 30%;
		font-size: 16px;
		font-weight: bold;
	}

	.inv-header {
		display: flex;
		width: 100%;
		height: 30%;
		font-size: 24px;
		font-weight: bold;
		justify-content: center;
		align-items: center;
	}

	.inv-players {
		display: flex;
		width: 60%;
		height: 30%;
		font-size: 16px;
		font-weight: bold;
	}

	.inv-players, .inv-bot, inv-players {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.invited-btn, .inv-decline-btn {
		display: flex;
		height: 80%;
		justify-content: center;
		align-items: center;
	}

	.invited-btn, .inv-decline-btn {
		color: black;
		border-style: hidden;
		border-radius: 5px;
	}

	.invited-btn, .inv-decline-btn {
		font-size: 16px;
		font-weight: bold;
	}

	.invited-btn, .inv-decline-btn {
		width: 180px;
	}

	.invited-card {
		display: flex;
		flex-direction: column;
		min-width: 400px;
		width: 80%;
		height: 300px;
		border-radius: 20px;
		border-style: hidden;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding: 20px;
	}

	.tourn-title-input input {
		padding-left: 40px;
	}

	.tourn-title-input .form-group {
		display: flex;
	}

	.tourn-title-input {
		width: 300px;
		margin-bottom: 25px;
	}

	.text-centered {
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 100%;
	}

	.tourn-inv-bubble {
		display: flex;
		width: 100%;
		height: 65%;
		flex-direction: column;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}

	.box-on .username, .inv-header, .invited-btn, .inv-decline-btn, .select-left {
		color: ${colors.primary_text};
	}

	.submit-button, .box-off .username, .friend-selection, .inv-players, .inv-bot {
		color: ${colors.second_text}
	}

	.box-off, .tournament-name, .tourn-inv-bubble {
		background-color: ${colors.main_card};
	}

	.select-left, .invited-card {
		background-color: ${colors.second_card};
	}

	.create-btn:hover, .submit-button:not(:disabled):hover, .back-btn:hover, .invited-btn:hover, .inv-decline-btn:hover, .box-on {
		background-color: ${colors.btn_default};
	}

	.create-btn, .back-btn, .submit-button:not(disabled), .invited-btn, .inv-decline-btn {
		background-color: ${colors.button};
	}

	.separator {
		background-color: ${colors.divider};
	}

	.hide {
		display: none;
	}
`;

const getHtml = function(data) {
	const html = `
	`;
	return html;
}

export default class CreateJoinTourn extends HTMLElement {
	static #componentName = "page-tournaments";

	constructor() {
		super()
		this.friendBoxData = [];
		this.tournInfo = getFakeActiveTourn();
		this.tournInv = getFakeTournInvites();
		this.inTournament = this.tournInfo.inTourn;
		console.log(this.tournInfo);
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

	#html(data) {
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#scripts() {
		this.#createJoinTourn();
		// this.#search();
		// this.#searchFriends();
		this.#changeOnlineStatus();
	}

	#tournCreation() {
		this.html.innerHTML = `
			<div class="tournament-creation">
				<div class="creation-top-bar">
					<button type="button" class="back-btn">Back</button>
					<div class="search-bar">
						<div class="form-group">
							<i class="search-icon bi bi-search"></i>
							<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="50">
						</div>
					</div>
				</div>
				<div class="tourn-title-input">
					<div class="form-group">
						<i class="search-icon bi bi-search"></i>
						<input type="text" class="form-control form-control-md" id="search" placeholder="Tournament title" maxlength="50">
					</div>
				</div>
				<div class="friend-selection"></div>
				<div class="creation-bottom-bar">
					<button class="submit-button">submit</button>
				</div>
			</div>
		`;
		this.#search();
		this.#searchFriends();
		this.html.querySelector(".back-btn").addEventListener("click", () => {
			this.#createJoinTourn();
		});
	}

	#createJoinTourn() {
		this.html.innerHTML = `
			<div class=create-join-tournament>
				<button type="button" class="create-btn">
						Create a Tournament
				</button>
				<div class="separator"></div>
				<div class="friend-invites"></div>
			</div>
		`;
		this.#showInvites(this.tournInv);
		this.html.querySelector(".create-btn").addEventListener("click", () => {
			this.#tournCreation();
		});
	}

	#friendSelection(friendList) {
		const friendSelectionHtml = this.html.querySelector(".friend-selection");
		friendSelectionHtml.innerHTML = "";
		if (!friendList) {
			friendSelectionHtml.innerHTML = "<div class=text-centered>No friend that matches your search!<div>";
			friendSelectionHtml.styles.
			return ;
		}
		friendList.forEach((friend) => {
			friendSelectionHtml.appendChild(this.#createCheckbox(friend));
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
			submitBtn.disabled = (this.friendBoxData.length != 3);
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
				else if (this.friendBoxData.length < 3) {
					elm.classList.add("box-on");
					this.friendBoxData.push(elm.id);
					elm.classList.remove("box-off");
				}
				if ((this.friendBoxData.length == 3))
					console.log("enabled!");
				else
					console.log("disabled");
				submitBtn.disabled = (this.friendBoxData.length != 3);
				console.log(this.friendBoxData);
			});
			return elm;
		}
	}

	#searchFriends() {
		const inp = this.html.querySelector(".search-bar").querySelector("input");
		if (!inp)
			return ;
		inp.addEventListener("input", event => this.#search(inp.value));
	}

	#search(value) {
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
				this.#friendSelection(data.friends);
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

		let friendHtml = this.html.querySelector(`#id-${value.id}`);
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
				<div class="tourn-inv-bubble">
					<div class="inv-header">${invite.name}</div>
					<div class="inv-players">
						<div>${invite.owner}</div>
						<div>${invite.p1}</div>
						<div>${invite.p2}</div>
					</div>
				</div>
				<div class="inv-bot">
					<button class="invited-btn">Join</button>
					<div>TIME <br> ELAPSED</div>
					<button class="inv-decline-btn">Decline</button>
				</div>
			`;
		}
		return elm;
	}
}
customElements.define("create-join-tourn", CreateJoinTourn);

const getFakeActiveTourn = function () {
	const data = `{
		"name": "Manga's Tourn",
		"inTourn": "false",
		"p1": "Manga",
		"p2": "candeia",
		"p3": "diogo",
		"p4": "pedro",
		"status": "ongoing",
		"left": "none",
		"right": "p3"
	}`;
	return JSON.parse(data);
}

const getFakeTournInvites = function() {

	const data = `[
	{
		"name": "Jhonny's tournament 2",
		"owner": "Jhonny",
		"p1": "Marth",
		"p2": "Clara"
	},
	{
		"name": "Frutinha",
		"owner": "Morango",
		"p1": "Manga",
		"p2": "Diogo"
	}
	]`;
	return JSON.parse(data);
}
