import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";

const styles = `
.game-page {
	justify-content: center;
	align-items: center;
	}

	.game-create {
		height: 100px;
		margin: 0px 0px 20px 0px;
		font-size: 16px;
	}

	.game-create {
		display: flex;
		border-radius: 10px;
		height: 10%;
		justify-content: center;
		align-items: center;
	}

	.create-btn {
		display: flex;
		width: 50%;
		height: 100px;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	.create-btn:hover, .invite-btn:hover, .invited-btn:hover {
		background-color: #C2C2C2;
	}

	.friend-invites {
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-radius: 10px;
		height: 1000px;
	}

	.invite-friends {
		display: none;
		height: 100%;
		flex-wrap: wrap;
		justify-content: left;
		align-items: flex-start;
		border-radius: 10px;
		font-size: 32px;
		font-weight: bold;
		gap: 10px;
	}

	.invite-card {
		display: flex;
		flex-direction: column;
		width: 18%;
		height: 300px;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
	}

	.invited-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 15%;
		height: 80%;
	}

	.inv-decline-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 10%;
		height: 80%;
	}

	.invited-card {
		display: flex;
		flex-direction: row;
		height: 10%;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
		margin-bottom: 10px;
	}

	.invite-card:hover .invite-btn, .back-btn:hover{
		background-color: #C2C2C2;
	}

	.profile-photo {
		width: 60%;
		height: 60%;
	}

	.pfp-invitee {
		width: 10%;
		height: 60%;
	}

	.invite-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80%;
		height: 15%;
	}

	.create-btn, .invite-btn, .invited-btn, .back-btn, .inv-decline-btn {
		color: white;
		border-style: hidden;
		border-radius: 5px;
	}

	.username, .create-btn, .invite-btn {
		font-size: 24px;
		font-weight: bold;
	}

	.back-btn {
		padding: 10px 20px;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		margin-right: 10px;
	}

	.inv-header {
		display:none;
		justify-content: left;
		margin: 0px, 0px, 10px;

	}

	.inv-header-text {
		font-size: 32px;
		font-weight: bold;
		margin-top: 20px;
		margin-bottom: 10px;
	}

	.game-create, .invite-card, .invited-card {
		background-color: #EEEEEE;
	}

	.create-btn, .invite-btn, .invited-btn, .back-btn {
		background-color: #E0E0E0;
	}

	.invite-card:hover {
		background-color: #E0E0E0;
	}
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="game"></side-panel>
		<div class="content content-small">
			<div id="game" class="game">
				<div class="game-create">
					<button type="button" class="create-btn">
						Create Game
					</button>
				</div>
				<div class="friend-invites"></div>
				<div class="inv-header">
					<button type="button" class="back-btn">
						Back
					</button>
					<div class="inv-header-text">
						FRIENDS TO INVITE
					</div>
					<br><br>
				</div>
				<div class="invite-friends">
				</div>
			</div>
		</div>
	`;
	return html;
}

// Need to make friend card with [name], [pfp], [timestamp], ofc a [button] to join the match, maybe [decline] and maybe a [short message]

const title = "BlitzPong - Game";

export default class PageGame extends HTMLElement {
	static #componentName = "page-game";

	constructor() {
		super()
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
		const friendList = getFriendsFakeCall();
		adjustContent(this.html.querySelector(".content"));
		this.#showInvites(friendList);
		this.#inviteFriends(friendList);
		this.html.querySelector(".create-btn").addEventListener("click", () => {
			this.#toggleInviteSection();
		});
		this.html.querySelector(".back-btn").addEventListener("click", () => {
			this.#toggleInviteSection();
		});
	}

	#inviteFriends(friendList) {
		const inviteFriendsHtml = this.html.querySelector(".invite-friends");
		friendList.forEach((friend) => {
			inviteFriendsHtml.appendChild(this.#getFriendHtml(friend));
		});
	}

	#getFriendHtml(friend) {
		const elm = document.createElement("button");
		elm.classList.add("invite-card");
		elm.id = `id-${friend.id}`;
		if (friend) {
			elm.innerHTML = `
				<img src="${friend.image}" class="profile-photo"/>
				<span class="username">${friend.username}</span>
				<div class="invite-btn">Invite</div>`;
		}
		return elm;
	}

	#toggleInviteSection() {
		const gameSection = this.html.querySelector(".game-create");
		const gameSection2 = this.html.querySelector(".friend-invites");
		const inviteFriendsSection = this.html.querySelector(".invite-friends");
		const inviteFriendsSection2 = this.html.querySelector(".inv-header");

		if (gameSection.style.display === "none") {
			gameSection.style.display = "flex";
			gameSection2.style.display = "flex";
			inviteFriendsSection.style.display = "none";
			inviteFriendsSection2.style.display = "none";
		} else {
			gameSection.style.display = "none";
			gameSection2.style.display = "none";
			inviteFriendsSection.style.display = "flex";
			inviteFriendsSection2.style.display = "flex";
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
				<img src="${invite.image}" class="pfp-invitee"/>
				<span class="username">${invite.username}</span>
				<div>TIME <br> ELAPSED</div>
				<button class="inv-decline-btn">X</button>
			`;
		}
		return elm;
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