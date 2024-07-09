import {redirect} from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";

const styles = `

	.tab-select {
		display: flex;
		width: 100%;
		height: 120px;
		background-color: #EEEEEE;
		justify-content: center;
		align-items: center;
	}

	.tab-select-btn {
		display: flex;
		width: 400px;
		height: 100px;
		color: white;
		background-color: #E0E0E0;
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
		justify-content: center;
		align-items: center;
		border-style: hidden;
		border-radius: 5px;
	}

	.active-tournaments {
		display: flex;
	}

	.past-tournaments {
		display: none;
	}

	.past-tournament-card {
		display: flex;
		width: 80%;
		height: 200px;
		justify-content: space-between;
		margin: 0px 0px 20px;
		background-color: #E0E0E0;
		border-style: hidden;
		border-radius: 5px;
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
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="tournaments"></side-panel>
		<div class="content content-small">
			<div class="tab-select">
				<button class="tab-select-btn">
					<div class="select-left">New/Current<br>tournament</div>
					<div class="select-right">Past<br>Tournaments</div>
				</button>
			</div>
			
			<div class="active-tournaments">NEW TOURNAMENTS GO HERE</div>
			<div class="past-tournaments">PAST TOURNAMENTS GO HERE</div>
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
		const pastTournamentsList = getFakeTournaments();
		adjustContent(this.html.querySelector(".content"));
		this.#toggleTabSelector();
		this.#getPastTournaments(pastTournamentsList);
	}


	#toggleTabSelector() {
		this.html.querySelector(".tab-select-btn").addEventListener("click", () => {
			const leftSlct = this.html.querySelector(".select-left");
			const rightSlct = this.html.querySelector(".select-right");
			const newTournaments = this.html.querySelector(".active-tournaments");
			const pastTournaments = this.html.querySelector(".past-tournaments");
			const isToggled = leftSlct.style.getPropertyValue('--toggled') === 'on';
			leftSlct.style.setProperty('--toggled', isToggled ? 'off' : 'on');
			if (isToggled) {
				leftSlct.style.backgroundColor = "#C2C2C2";
				rightSlct.style.backgroundColor = "#E0E0E0";
				leftSlct.style.color = "white";
				rightSlct.style.color = "#C2C2C2";
				newTournaments.style.display = "flex";
				pastTournaments.style.display = "none";
			} else {
				leftSlct.style.backgroundColor = "#E0E0E0";
				rightSlct.style.backgroundColor = "#C2C2C2";
				leftSlct.style.color = "#C2C2C2";
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

	}
	
	customElements.define(PageTournaments.componentName, PageTournaments);
	
	
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