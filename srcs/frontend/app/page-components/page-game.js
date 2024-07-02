import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";

const styles = `
	.game-page {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}

	.game-create {
		background-color: #EEEEEE;
		height: 100px;
		margin: 0px 0px 20px 0px;
		font-size: 16px;
	}

	.game-create {
		display: flex;
		height: 200px;
		cursor: pointer;
		border-radius: 10px;
		height: 10%;
		justify-content: center;
		align-items: center;
	}

	.create-button {
		display: flex;
		width: 50%;
		height: 100px;
		justify-content: center;
		align-items: center;
	}

	.create-button:hover, .invite-button:hover {
		background-color: #C2C2C2;
	}
	
	.game-create, .friend.invites, invite.friends {
		width: 1000px;
	}

	.friend-invites {
		display: flex;
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
		background-color: #EEEEEE;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
	}

	.invite-card:hover {
		background-color: #E0E0E0;
	}

	.invite-card:hover .invite-button, .back-button:hover{
		background-color: #C2C2C2;
	}

	.profile-photo {
		width: 60%;
	}

	.invite-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80%;
		height: 15%;
	}

	.create-button, .invite-button {
		color: white;
		border-style: hidden;
		background-color: #E0E0E0;
		border-radius: 5px;
	}

	.username, .create-button, .invite-button {
		font-size: 24px;
		font-weight: bold;
	}

	.back-button {
		color: white;
		background-color: #E0E0E0;
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		margin-right: 10px;
	}

	.inv-header {
		display:flex;
		justify-content: left;
		margin: 0px, 0px, 10px;

	}

	.inv-header-text {
		font-size: 32px;
		font-weight: bold;
		margin-top: 20px;
		margin-bottom: 10px;
	}
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="game"></side-panel>
		<div class="content content-small game-page">
			<div id="game" class="game">
				<div class="game-create">
					<button type="button" class="create-button">
						Create Game
					</button>
				</div>
				<div class="friend-invites">
					FRIENDS GO HERE
				</div>
				<div class="inv-header">
					<button type="button" class="back-button">
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
		this.#inviteFriends(friendList);
		this.html.querySelector(".create-button").addEventListener("click", () => {
			this.#toggleInviteSection();
		});
		this.html.querySelector(".back-button").addEventListener("click", () => {
			this.#toggleInviteSection();
		});
	}

	#inviteFriends(friendList) {
		const inviteFriendsHtml = this.html.querySelector(".invite-friends");
		friendList.forEach((friend) => {
			inviteFriendsHtml.appendChild(this.#getInviteHtml(friend));
		});
	}

	#getInviteHtml(friend) {
		const elm = document.createElement("button");
		elm.classList.add("invite-card");
		elm.id = `id-${friend.id}`;
		if (friend) {
			elm.innerHTML = `
				<img src="${friend.image}" class="profile-photo"/>
				<span class="username">${friend.username}</span>
				<div class="invite-button">Invite</div>`;
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