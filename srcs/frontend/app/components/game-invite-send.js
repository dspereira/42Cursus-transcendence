import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { enGameInviteSendDict } from "../lang-dicts/enLangDict.js";
import { ptGameInviteSendDict } from "../lang-dicts/ptLangDict.js";
import { esGameInviteSendDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
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

	.friend-list {
		display: flex;
		flex-wrap: wrap;
		gap: 30px;
		justify-content: center;
	}

	.send-invite-section {
		display: flex;
		gap: 30px;
	}
	
	.friend-section {
		width: 80%;
		padding: 20px;
		border-radius: 5px;
		height: 90vh;
		background-color: #D3D3D3;
	}

	.selcted-list-section {
		width: 20%;
		padding: 20px;
		border-radius: 5px;
		height: 90vh;
		background-color: #D3D3D3;
	}
		
	.friend-right-list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}
	
	.friend-right-list span {
		font-size: 20px;
		font-weight: bold;
	}

	.cross-icon {
		color: red;
		font-size: 24px;
		cursor: pointer;
	}

	.cross-icon:hover {
		color: blue; /* outra cor igual mas mais carregada */
	}
}
`;

const getHtml = function(data) {
	const html = `
	<!--<h3>Invite a Friend For a Challenge!</h3>-->

	<div class="send-invite-section">
		<div class="friend-section">
			<div class="search-bar">
				<div class="form-group">
					<i class="search-icon bi bi-search"></i>
					<input type="text" class="form-control form-control-md" id="search" placeholder="${data.langDict.search_bar_placeholder_search}" maxlength="50">
				</div>
			</div>
			<div class="friend-list"></div>
		</div>
		<div class="selcted-list-section"></div>
		<div><button type="button" class="btn btn-primary" id="submit-invite">${data.langDict.invite_button}</button><div>
	</div>
	`;
	return html;
}

export default class GameInviteSend extends HTMLElement {
	static observedAttributes = ["username", "profile-photo", "language"];

	constructor() {
		super()
		this.data = {};
		this.selectedElm = [];
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "profile-photo")
			name = "profilePhoto";
		if (name == "language")
			this.data.langDict = getLanguageDict(newValue, enGameInviteSendDict, ptGameInviteSendDict, esGameInviteSendDict);
		this.data[name] = newValue;
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
		this.rightFriendListElm = this.html.querySelector(".selcted-list-section");
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
		this.#getFriendsCallApi();
		this.#setFriendsSearchEvent();
		this.#setInviteSubmitEvent();
	}

	#setFriendsSearchEvent() {
		const searchBar = this.html.querySelector("#search");
		if (searchBar)
			searchBar.addEventListener("input", event => this.#getFriendsCallApi(searchBar.value));
	}

	#getFriendsCallApi(key) {
		let queryParam = "";
		if (key)
			queryParam = `?key=${key}`;

		callAPI("GET", `http://127.0.0.1:8000/api/friends/friendships/${queryParam}`, null, (res, data) => {
			if (res.ok) {
				this.#createFriendsList(data.friends);
				this.#selectFriendEvent();
			}
		});
	}

	#createFriendsList(friends) {
		const friendList = this.html.querySelector(".friend-list");
		friendList.innerHTML = "";
		let friendCard;
		if (!friendList || !friends)
			return ;
		friends.forEach(elm => {
			friendCard = document.createElement("game-invite-card1");
			friendCard.setAttribute("username", elm.username);
			friendCard.setAttribute("profile-photo", elm.image);
			friendCard.id = `id-${elm.id}`;
			if(this.selectedElm.find(e => e == friendCard.id))
				friendCard.setAttribute("selected", "true");
			friendList.appendChild(friendCard);
		});
	}

	#selectFriendEvent() {
		let friendList = this.html.querySelectorAll("game-invite-card1");
		if (!friendList)
			return ;

		friendList.forEach(elm => {
			elm.addEventListener("click", () => {
				if (elm.getAttribute("selected") == "true")
					this.#unselectFriend(elm.id);
				else
					this.#selectFriend(elm);
			});
		});
	}

	#selectFriend(friendCard) {
		const rightListFriendHtml = this.#getFriendHtmlForRightList(friendCard.id);
		const listLength = this.rightFriendListElm.length;

		if (!listLength)
			this.rightFriendListElm.appendChild(rightListFriendHtml);
		else
			this.rightFriendListElm.insertBefore(this.rightFriendListElm[listLength - 1], rightListFriendHtml);
		
		friendCard.setAttribute("selected", "true");
		this.selectedElm.push(friendCard.id);
	}

	#unselectFriend(elmId) {
		const friendCard = this.html.querySelector(`#${elmId}`);
		const friendRightList = this.rightFriendListElm.querySelector(`.${elmId}`);

		if (!friendCard && !friendRightList)
			return ;
		friendCard.setAttribute("selected", "false");
		this.rightFriendListElm.removeChild(friendRightList);
		const index = this.selectedElm.indexOf(elmId);
		if (index > -1)
			this.selectedElm.splice(index, 1);
	}

	#getFriendHtmlForRightList(elmId) {
		const elm = document.createElement("div");

		const friendElm = this.html.querySelector(`#${elmId}`);
		if (!friendElm)
			return ;
		const name = friendElm.getAttribute("username");

		elm.classList.add("friend-right-list");
		elm.classList.add(`${elmId}`);
		elm.innerHTML = `
			<div><span>${name}</span></div>
			<div class="cross-icon ${elmId}" ><i class="bi bi-x-lg"></i></div>
		`;
		this.#addCrossIconEvent(elm.querySelector(".cross-icon"))
		return elm;
	}

	#addCrossIconEvent(elmHtml) {
		if (!elmHtml)
			return ;
		elmHtml.addEventListener("click", () => this.#unselectFriend(elmHtml.classList[1]));
	}

	#setInviteSubmitEvent() {
		const btn = this.html.querySelector("#submit-invite");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			const data = {
				invites_list: []
			};
			this.selectedElm.forEach((elm) => {
				data.invites_list.push(elm.substring(3));
			});
			callAPI("POST", "http://127.0.0.1:8000/api/game/request/", data, (res, data) => {
				if (res.ok) {
					const contentElm = document.querySelector(".content");
					contentElm.innerHTML = `
					<app-lobby 
						lobby-id="${stateManager.getState("userId")}"
						language="${this.data.language}"
					></app-lobby>
					`;
				}
			});
		});
	}
}

customElements.define("game-invite-send", GameInviteSend);
