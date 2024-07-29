import {redirect} from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import {colors} from "../js/globalStyles.js";

const styles = `

	create-join-tourn, app-past-tourn, current-tournament {
		width: 100%;
	}

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
	}

	.select-right {
		border-radius: 0px 5px 5px 0px;
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
	}

	.tourn-inv .tourn-p-img {
		width: 100px;
		height: 100px;
	}

	.tourn-p-card {
		display: flex;
		width: 100%;
		max-width: 300px;
		height: 40%;
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
		width: 400px;
		height: 300px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		border-style: hidden;
		padding: 0px 20px 0px 20px;
		font-size: 16px;
		font-weight: bold;
	}

	.tourn-inv-inner {
		display: flex;
		width: 40%;
		height: 100%;
		flex-direction: column;
		margin: 20px;
		justify-content: center;
		align-items: center;
		font-align: center;
		font-size: 24px;
		font-weight: bold;
	}

	.tourn-inv-status, .tourn-inv-time {
		display: flex;
		width: 100%;
		font-size: 24px;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.tourn-inv-status {
		color: green;
		margin-bottom: 20px;
	}

	.tourn-inv-box {
		display: flex;
		width: 100%;
		flex-direction: row;
		justify-content: space-between;
		padding: 0px 200px 0px 200px;
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

	.separator-v {
		display: flex;
		width: 5px;
		height: 80%;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
		margin: 0px 20px 0px 20px;
	}

	.separator-v-light {
		display: flex;
		width: 5px;
		height: 80%;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
		margin: 0px 20px 0px 20px;
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

	.inv-header, .invited-btn, .inv-decline-btn, .select-left {
		color: ${colors.primary_text};
	}

	.select-right {
		color: ${colors.second_card};
	}

	.tourn-name, .tab-select-btn, .test-change, .submit-button, .tourn-inv-inner, .inv-players, .inv-bot {
		color: ${colors.second_text};
	}

	 .tourn-p-card, .tourn-inv-time {
		color: ${colors.third_text};
	}

	.box-off, .friend-search, .tournament-name, .tab-select-btn, .test-change, .tourn-card, .tourn-inv, .select-right {
		background-color: ${colors.main_card};
	}

	.select-left, .invited-card {
		background-color: ${colors.second_card};
	}

	.create-btn:hover, .submit-button:not(:disabled):hover, .back-btn:hover, .invited-btn:hover, .inv-decline-btn:hover, .box-on {
		background-color: ${colors.button_hover};
	}

	.create-btn, .back-btn, .submit-button:not(disabled), .invited-btn, .inv-decline-btn, .tourn-name, .tourn-p-card {
		background-color: ${colors.button};
	}

	.separator {
		background-color: ${colors.divider};
	}

	.separator-v {
		background-color: ${colors.page_background};
	}

	.hide {
		display: none;
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
				<div class="active-tournaments">
					<current-tournament></current-tournament>
					<create-join-tourn></create-join-tourn>
				</div>
				<app-past-tourn class="hide"></app-past-tourn>
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
		// const pastTournamentsList = getFakeTournaments();
		adjustContent(this.html.querySelector(".content"));
		this.#toggleTabSelector();
		this.#activeTournaments();
		// this.#testChangePage();
	}

	#createJoinTourn(activeTournamentsHtml) {
		const currentTournHtml = activeTournamentsHtml.querySelector("current-tournament");
		currentTournHtml.classList.add("hide");
		const createJoinHtml = activeTournamentsHtml.querySelector("create-join-tourn");
		createJoinHtml.classList.remove("hide");
	}

	#currentTourn(activeTournamentsHtml) {
		const currentTournHtml = activeTournamentsHtml.querySelector("current-tournament");
		currentTournHtml.classList.remove("hide");
		const createJoinHtml = activeTournamentsHtml.querySelector("create-join-tourn");
		createJoinHtml.classList.add("hide");
	}

	#activeTournaments() {
		const activeTournamentsHtml = this.html.querySelector(".active-tournaments");
		// console.log("inTourn", "val = ", this.tournInfo.inTourn === "true", " | ", this.tournInfo.inTourn);
		if (this.tournInfo.inTourn !== "true")
			this.#createJoinTourn(activeTournamentsHtml);
		else 
			this.#currentTourn(activeTournamentsHtml);
	}

	#toggleTabSelector() {
		this.html.querySelector(".tab-select-btn").addEventListener("click", () => {
			const leftSlct = this.html.querySelector(".select-left");
			const rightSlct = this.html.querySelector(".select-right");
			const newTournaments = this.html.querySelector(".active-tournaments");
			const pastTournaments = this.html.querySelector("app-past-tourn");
			const isToggled = leftSlct.style.getPropertyValue('--toggled') === 'on';
			const highlight = colors.second_card;
			const background = colors.main_card;
			leftSlct.style.setProperty('--toggled', isToggled ? 'off' : 'on');
			if (isToggled) {
				leftSlct.style.backgroundColor = highlight;
				rightSlct.style.backgroundColor = background;
				leftSlct.style.color = "white";
				rightSlct.style.color = highlight;
				newTournaments.style.display = "flex";
				pastTournaments.classList.add("hide");
			} else {
				leftSlct.style.backgroundColor = background;
				rightSlct.style.backgroundColor = highlight;
				leftSlct.style.color = highlight;
				rightSlct.style.color = "white";
				newTournaments.style.display = "none";
				pastTournaments.classList.remove("hide");
			}
		});
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
