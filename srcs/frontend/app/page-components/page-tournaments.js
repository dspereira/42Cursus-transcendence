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

	.tab-select-btn {
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
		position: fixed;
		bottom: 0;
	}

	.friend-selection {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		flex-grow: 1;
	}

	.friend-box[type=checkbox] + label {
		display: flex;
		flex-direction: column;
		width: 150px;
		height: 200px;
		border-radius: 10px;
		border-style: hidden;
		justify-content: center;
		align-items: center;
		background-color: #EEEEEE;
		margin: 10px;
	}

	.friend-box[type="checkbox"]:checked + label {
		background-color: #C2C2C2;
	}

	.friend-box[type=checkbox] + label:hover {
		border-color: red;
	}

	.friend-box[type=checkbox] {
		display: none;
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

	.friend-search, .tournament-name {
		background-color: #EEEEEE;
	}

	.friend-search::placeholder, .tournament-name::placeholder {
		color: #C2C2C2;
	}

	.friend-search:focus, .tournament-name:focus {
		box-shadow: none;
		border: none;
		border-radius: 5px;
	}

	.friend-search:focus-visible, .tournament-name:focus-visible {
		outline: 3px solid #C2C2C2;
	}

	.tournament-creation {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: space-between;
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
		background-color: #E0E0E0;
	}

	.submit-button:not(:disabled):hover {
		background-color: #C2C2C2;
	}

	.submit-button:disabled {
		background-color: light-red;
		cursor: not-allowed;
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
				<div class="active-tournaments">NEW TOURNAMENTS GO HERE
					<div class="tournament-creation">
						<div class="creation-top-bar">
							<input class="tournament-name" placeholder="Choose a Title"></input>
							<input class="friend-search" placeholder="Search"></input>
						</div>
						<div class="friend-selection"></div>
						<div class="creation-bottom-bar">
							<button class="submit-button">submit</button>
						</div>
					</div>
				</div>
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
		this.#initComponent();
		this.#render();
		this.#scripts();
		this.#search();
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
		const friendList = getFriendsFakeCall();
		const pastTournamentsList = getFakeTournaments();
		adjustContent(this.html.querySelector(".content"));
		this.#toggleTabSelector();
		this.#getPastTournaments(pastTournamentsList);
		// this.#friendSelection(friendList);
		this.#searchFriends();
		this.#checkboxMax(3);
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

	#checkboxMax(max) {
		console.log("hi")
		const boxes = this.html.querySelectorAll(".friend-box[type=checkbox]").forEach((box) => {
			box.addEventListener("click", () => {
				console.log("click");
				this.#maxBoxes(max);
			})
		})
		console.log("box count", boxes);
	}

	#maxBoxes(max) {
		const checkboxes = this.html.querySelectorAll('.friend-box[type=checkbox]');
		const inviteBtn = this.html.querySelector(".submit-button");
		function updateCheckboxState() {
			const checkedCount = document.querySelectorAll('.friend-box[type=checkbox]:checked').length;
			inviteBtn.disabled = (checkedCount !== 4);
			console.log("checked count = ", checkedCount);
			if (checkedCount >= max) {
				checkboxes.forEach(checkbox => {
					if (!checkbox.checked) {
						checkbox.disabled = true;
					}
				});
			} else {
				checkboxes.forEach(checkbox => {
					checkbox.disabled = false;
				});
			}
		}
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener("change", updateCheckboxState);
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
		if (!friendList)
		{
			friendSelectionHtml.innerHTML = "<div>No friend that matches your search!<div>";
			return ;
		}
		friendList.forEach((friend) => {
			friendSelectionHtml.appendChild(this.#createCheckbox(friend));
			friendSelectionHtml.appendChild(this.#createLabel(friend));
		});
	}

	#createCheckbox(friend) {
		if (friend)
		{
			const elm = document.createElement("input");
			elm.classList.add("friend-box");
			elm.id = `id-${friend.id}`;
			elm.type = "checkbox";
			return elm;
		}
	}

	#createLabel(friend) {
		const elm = document.createElement("label");
		elm.htmlFor = `id-${friend.id}`;
		if (friend) {
			elm.innerHTML = `
				<img src="${friend.image}" class="profile-photo"/>
				<span class="username">${friend.username}</span>
			`
		}
		return elm;
	}

	#searchFriends() {
		const inp = this.html.querySelector(".friend-search");
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
				this.#friendSelection(data.friends);
				// if (type=="friends" && data.friends)
				// 	//criar os cards
				// else {
				// 	userList.innerHTML = "<h1>Username not Found!</h1>";
				// }
			}
		});
	}
}
customElements.define(PageTournaments.componentName, PageTournaments);


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
	}
]`;
	return JSON.parse(data);
}