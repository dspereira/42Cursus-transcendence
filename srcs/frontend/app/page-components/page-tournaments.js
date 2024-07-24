import {redirect} from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";

const styles = `

	.page-container {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.tab-select {
		display: flex;
		width: 100%;
		height: 50px;
		justify-content: start;
		align-items: start;
	}

	.tab-select-btn, .test-change {
		display: flex;
		width: 600px;
		height: 50px;
		color: white;
		background-color: #EEEEEE;
		border-style: hidden;
		border-radius: 5px;
	}

	.select-left, .select-right{
		display: flex;
		width: 50%;
		height: 100%;
		border-style: hidden;
		justify-content: center;
		align-items: center;
		--toggled: off;
		font-size: 16px;
		font-weight: bold;
		transition: .5s;
	}

	.select-left {
			border-radius: 5px 0px 0px 5px;
			background-color: #C2C2C2;
	}

	.select-right {
		border-radius: 0px 5px 5px 0px;
		background-color: #E0E0E0;
	}

	.active-tournaments, .past-tournaments {
		width: 100%;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		border-style: hidden;
		border-radius: 10px;
		margin: 20px 20px 0px 20px;
	}

	.active-tournaments {
		display: flex;
	}

	.past-tournaments {
		display: none;
		overflow-y: auto;
	}

	.past-tournament-card {
		display: flex;
		width: 80%;
		height: 200px;
		justify-content: space-between;
		margin: 0px 0px 20px;
		background-color: #E0E0E0;
		border-style: hidden;
		border-radius: 20px;
	}
	
	.card-box {
		display: flex;
		width: 150px;
		height: 80%;
		justify-content: center;
		align-items: center;
		margin-left: 20px;
		margin-right: 20px;
	}

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

	.friend-search; {
		width: 200px;
	}

	.tournament-name {
		width: 400px;
	}

	.friend-search, .tournament-name {
		height: 50px;
		color: #C2C2C2;
		text-align: center;
		border-style: hidden;
		border-radius: 5px;
	}

	.box-on, .create-btn:hover, .submit-button:not(:disabled):hover, .back-btn:hover  {
		background-color: #C2C2C2;
	}

	.box-off, .friend-search, .tournament-name {
		background-color: #EEEEEE;
	}

	.friend-search:focus, .tournament-name:focus {
		box-shadow: none;
		border: none;
		border-radius: 5px;
	}

	.friend-search:focus-visible, .tournament-name:focus-visible {
		outline: 3px solid #C2C2C2;
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

	.create-btn, .back-btn, .submit-button:not(disabled), .separator {
		background-color: #E0E0E0;
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

	.friend-search::placeholder, .tournament-name::placeholder {
		color: #C2C2C2;
	}

	.current-tourn {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.tourn-name {
		display: flex;
		width: 100%;
		max-width: 1000px;
		background-color: #E0E0E0;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
		margin: 0px 10px 0px 10px;
		font-size: 24px;
		font-weight: bold;
	}
	
	.tourn-card {
		display: flex;
		width: 100%;
		height: 300px;
		flex-direction: column;
		background-color: #EEEEEE;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		border-style: hidden;
	}

	.tourn-div-top {
		display: flex;
		width: 100%;
		height: 20%;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.tourn-div-mid {
		display: flex;
		width: 100%;
		height: 70%;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.tourn-s-bar, .tourn-m-bar {
		display: flex;
		width: 30%;
		height: 80%;
		justify-content: center;
		align-items: center;
		margin: 20px;
	}

	.tourn-s-bar {
		width: 20%;
		flex-direction: column;
	}

	.tourn-m-bar {
		width: 50%;
		flex-direction: row;
	}

	.tourn-p-img {
		width: 50px;
		height: 50px;
		margin-right: 20px;
	}

	.tourn-p-card {
		display: flex;
		width: 100%;
		max-width: 300px;
		height: 40%;
		background-color: #E0E0E0;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		border-style: hidden;
		margin: 5px;
		font-size: 16px;
		font-weight: bold;
	}

	.tourn-inv {
		display: flex;
		width: 100%;
		height: 100px;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		border-style: hidden;
		background-color: #EEEEEE;
		margin-top: 20px;
		padding: 0px 50px 0px 50px;
		font-size: 16px;
		font-weight: bold;
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
		height: 60%;
		margin: 0px 20px 0px 20px;
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

	.invited-btn, .inv-decline-btn {
		background-color: #E0E0E0;
	}

	.invited-btn:hover, .inv-decline-btn:hover {
		background-color: #C2C2C2;
	}

	.invited-card {
		display: flex;
		flex-direction: column;
		width: 80%;
		height: 300px;
		border-radius: 20px;
		border-style: hidden;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.invited-card {
		background-color: #EEEEEE;
	}
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="tournaments"></side-panel>
		<div class="content content-small">
		<div class="page-container">
				<div class="tab-select">
					<button class="tab-select-btn">
						<div class="select-left">New/Current tournament</div>
						<div class="select-right">Tournament History</div>
					</button>
				</div>
				<div class="active-tournaments"></div>
				<div class="past-tournaments">PAST TOURNAMENTS GO HERE</div>
			</div>
		</div>
	`;
	return html;
}

const title = "Tournaments";

export default class PageTournaments extends HTMLElement {
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
		stateManager.setState("pageReady", true);
	}

	#scripts() {
		const pastTournamentsList = getFakeTournaments();
		adjustContent(this.html.querySelector(".content"));
		this.#toggleTabSelector();
		this.#activeTournaments();
		this.#getPastTournaments(pastTournamentsList);
		// this.#search();
		// this.#searchFriends();
		this.#changeOnlineStatus();
		// this.#testChangePage();
	}

	#testChangePage() {
		const changeHtml = this.html.querySelector(".test-change");
		changeHtml.addEventListener("click", () => {
			this.inTournament = !this.inTournament;
			this.#activeTournaments();
			this.#search();
		});
	}

	#tournCreation(activeTournamentsHtml) {
		activeTournamentsHtml.innerHTML = `
			<div class="tournament-creation">
				<div class="creation-top-bar">
					<button type="button" class="back-btn">Back</button>
					<input class="tournament-name" placeholder="Choose a Title"></input>
					<div class="search-bar">
						<div class="form-group">
							<i class="search-icon bi bi-search"></i>
							<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="50">
						</div>
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
		activeTournamentsHtml.querySelector(".back-btn").addEventListener("click", () => {
			this.#createJoinTourn(activeTournamentsHtml);
		});
	}

	#createJoinTourn(activeTournamentsHtml) {
		activeTournamentsHtml.innerHTML = `
			<div class=create-join-tournament>
				<button type="button" class="create-btn">
						Create a Tournament
				</button>
				<div class="separator"></div>
				<div class="friend-invites"></div>
			</div>
		`;
		this.#showInvites(this.tournInv);
		activeTournamentsHtml.querySelector(".create-btn").addEventListener("click", () => {
			this.#tournCreation(activeTournamentsHtml);
		});
	}

	#activeTournaments() {
		const activeTournamentsHtml = this.html.querySelector(".active-tournaments");
		// console.log("inTourn", "val = ", this.tournInfo.inTourn === "true", " | ", this.tournInfo.inTourn);
		if (this.tournInfo.inTourn !== "true") {
			this.#createJoinTourn(activeTournamentsHtml);
		}
		else {
			activeTournamentsHtml.innerHTML = `
				<div class="current-tourn">
					<div class=tourn-card>
						<div class=tourn-div-top>
							<div class=tourn-name>${this.tournInfo.name}</div>
						</div>
						<div class=tourn-div-mid>
							<div class=tourn-s-bar>
								<div class=tourn-p-card>
									<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p1}" class="tourn-p-img"></img>
									${this.tournInfo.p1}
								</div>
								<div class=tourn-p-card>
									<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p2}" class="tourn-p-img"></img>
									${this.tournInfo.p2}
								</div>
							</div>
							<div class=tourn-m-bar>
								<div class=tourn-p-card>${this.tournInfo.left}</div>
								<div class=tourn-p-card>${this.tournInfo.right}</div>
							</div>
							<div class=tourn-s-bar>
								<div class=tourn-p-card>
									<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p3}" class="tourn-p-img"></img>
									${this.tournInfo.p3}
								</div>
								<div class=tourn-p-card>
									<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p4}" class="tourn-p-img"></img>
									${this.tournInfo.p4}
								</div>
							</div>
						</div>
					</div>
					<div class="tourn-inv">
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p1}" class="tourn-p-img"></img>
						${this.tournInfo.p1}
						<div>Status</div>
						<div>Elapsed<br>Time</div>
					</div>
					<div class="tourn-inv">
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p2}" class="tourn-p-img"></img>
						${this.tournInfo.p2}
						<div>Status</div>
						<div>Elapsed<br>Time</div>
					</div>
					<div class="tourn-inv">
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p3}" class="tourn-p-img"></img>
						${this.tournInfo.p3}
						<div>Status</div>
						<div>Elapsed<br>Time</div>
					</div>
					<div class="tourn-inv">
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p4}" class="tourn-p-img"></img>
						${this.tournInfo.p4}
						<div>Status</div>
						<div>Elapsed<br>Time</div>
					</div>
				</div>
			`;
		}
	}

	#toggleTabSelector() {
		this.html.querySelector(".tab-select-btn").addEventListener("click", () => {
			const leftSlct = this.html.querySelector(".select-left");
			const rightSlct = this.html.querySelector(".select-right");
			const newTournaments = this.html.querySelector(".active-tournaments");
			const pastTournaments = this.html.querySelector(".past-tournaments");
			const isToggled = leftSlct.style.getPropertyValue('--toggled') === 'on';
			const highlight = "#C2C2C2";
			const background = "#EEEEEE";
			leftSlct.style.setProperty('--toggled', isToggled ? 'off' : 'on');
			if (isToggled) {
				leftSlct.style.backgroundColor = highlight;
				rightSlct.style.backgroundColor = background;
				leftSlct.style.color = "white";
				rightSlct.style.color = highlight;
				newTournaments.style.display = "flex";
				pastTournaments.style.display = "none";
			} else {
				leftSlct.style.backgroundColor = background;
				rightSlct.style.backgroundColor = highlight;
				leftSlct.style.color = highlight;
				rightSlct.style.color = "white";
				newTournaments.style.display = "none";
				pastTournaments.style.display = "flex";
			}
		});
	}

	#getPastTournaments(pastTournaments) {
		const pastTournamentsHtml = this.html.querySelector(".past-tournaments");
		pastTournaments.forEach((tournament) => {
			pastTournamentsHtml.appendChild(this.#pastTournamentCard(tournament));
		});
	}

	#pastTournamentCard(tournament) {
		const elm = document.createElement("div");
		elm.classList.add("past-tournament-card");
		if (tournament) {
			elm.innerHTML = `
				<div class="card-box" style="font-size:24px">${tournament.name}</div>
				<div class="card-box"">1st: ${tournament.first}<br>2nd: ${tournament.second}<br>3rd: ${tournament.third}<br>4th: ${tournament.fourth}</div>
				<div class="card-box"">${tournament.date}</div>
			`;
		}
		return elm;
	}

	#friendSelection(friendList) {
		const friendSelectionHtml = this.html.querySelector(".friend-selection");
		friendSelectionHtml.innerHTML = "";
		if (!friendList) {
			friendSelectionHtml.innerHTML = "<div>No friend that matches your search!<div>";
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

				<div class="inv-header">${invite.name}</div>
				<div class="inv-players">
					<div>${invite.owner}</div>
					<div>${invite.p1}</div>
					<div>${invite.p2}</div></div>
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
customElements.define(PageTournaments.componentName, PageTournaments);

const getFakeActiveTourn = function () {
	const data = `{
		"name": "Manga's Tourn",
		"inTourn": "true",
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

const getFakeTournaments = function () {
	const data = `[
	{
		"name": "Jhonny's tournament",
		"first": "Jhonny",
		"second": "Clara",
		"third": "Arthur",
		"fourth": "Marth",
		"date": "05/07/24"
	},
	{
		"name": "Summer Bash",
		"first": "Alice",
		"second": "Bob",
		"third": "Charlie",
		"fourth": "Diana",
		"date": "06/15/24"
	},
	{
		"name": "Winter Cup",
		"first": "Eve",
		"second": "Frank",
		"third": "Grace",
		"fourth": "Hank",
		"date": "12/10/24"
	},
	{
		"name": "Spring Showdown",
		"first": "Ivy",
		"second": "Jack",
		"third": "Karen",
		"fourth": "Leo",
		"date": "03/21/24"
	},
	{
		"name": "Autumn Clash",
		"first": "Mona",
		"second": "Nate",
		"third": "Olive",
		"fourth": "Paul",
		"date": "09/30/24"
	}]`;
	return JSON.parse(data);
}