import { callAPI } from "../utils/callApiUtils.js";

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

	.hide {
		display: none;
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
					<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="50">
				</div>
			</div>
			<div class="friend-list"></div>
		</div>
		<div class="selcted-list-section"></div>
	</div>
	`;
	return html;
}

export default class GameInviteSend extends HTMLElement {
	static observedAttributes = ["username", "profile-photo"];

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
				if (elm.getAttribute("selected") == "true") {
					elm.setAttribute("selected", "false");
					this.selectedElm.pop(elm.id);
				}
				else {
					elm.setAttribute("selected", "true");
					this.selectedElm.push(elm.id);
				}
				this.#fillRightListOfSelectedFriends();
			});
		});
	}

	#fillRightListOfSelectedFriends() {
		this.rightFriendListElm.innerHTML = "";
		console.log(this.selectedElm);
		this.selectedElm.forEach(elm => {
			this.rightFriendListElm.appendChild(this.#getFriendHtmlForRightList(elm))
		});
	}

	#getFriendHtmlForRightList(elmId) {
		const elm = document.createElement("div");
		const friendElm = this.html.querySelector(`#${elmId}`);
		if (!friendElm)
			return ;
		const name = friendElm.getAttribute("username");

		elm.classList.add("friend-right-list");
		elm.innerHTML = `
		<div><span>${name}</span></div>
		<div class="cross-icon"><i class="bi bi-x-lg"></i></div>
		`;

		this.#addCrossIconEvent(elm.querySelector(".cross-icon"))
		return elm;
	}

	#addCrossIconEvent(elmHtml) {
		if (!elmHtml)
			return ;
		elmHtml.addEventListener("click", () => {
			//elmHtml.classList.add("hide");
		});
	}

}

customElements.define("game-invite-send", GameInviteSend);
