import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";

const styles = `
.border-separation {
	width: 60%;
	margin: 0 auto;
	margin-top: 25px;
	margin-bottom: 25px;
	border-bottom: 3px solid #EEEDEB;
}

.create-tourney {
	display: flex;
	justify-content: center;
}

.btn-create-tourney {
	padding: 10px 70px 10px 70px;
}

/*
.hide {
	display: none;
}
	*/
`;

const getHtml = function(data) {
	const html = `
	<app-header></app-header>
	<side-panel selected="tournaments"></side-panel>
	<div class="content content-small">
		<!--<h1>Tournaments</h1>-->
		<!--<tourney-graph></tourney-graph>-->
		<!--<tourney-lobby></tourney-lobby>-->

		<div class="btn-create-tourney-section hide">
			<div class="create-tourney">
				<button type="button" class="btn btn-primary btn-create-tourney">Create Tornement</button>
			</div>
			<div class="border-separation"></div>
		</div>
		<div class="tourney-section">
		</div>
		<div class="invites-received">
			<tourney-invites-received></tourney-invites-received>
		<div>


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
		this.btnCreateTourneySection = this.html.querySelector(".btn-create-tourney-section");
		this.tourneySection = this.html.querySelector(".tourney-section");
		this.invitesReceived = this.html.querySelector(".invites-received");
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
		adjustContent(this.html.querySelector(".content"));
		this.#createTournamentEvent();
		this.#checkActiveTournamentCall();
		this.#setStateEvent();
	}

	#createTournamentEvent() {
		const btn = this.html.querySelector(".btn-create-tourney");
		btn.addEventListener("click", () => {
			callAPI("POST", `http://127.0.0.1:8000/api/tournament/`, null, (res, data) => {					
				if (res.ok) {
					const content = this.html.querySelector(".content");
					content.innerHTML = `
						<tourney-lobby 
							tournament-id="${data.tournament_id}"
							owner-id="${stateManager.getState("userId")}"
						></tourney-lobby>`;
				}
			});
		});
	}

	#checkActiveTournamentCall() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/active-tournament/`, null, (res, data) => {					
			if (res.ok && data && data.tournament) {
				const torneyData = data.tournament;
				this.btnCreateTourneySection.classList.add("hide");
				if (torneyData.status == "created") {
					this.tourneySection.innerHTML = `
					<tourney-lobby
						tournament-id="${torneyData.id}"
						owner-id="${torneyData.owner}"
					></tourney-lobby>`;

					this.invitesReceived.innerHTML = "";
				}
				else if (torneyData.status == "active") {
					this.tourneySection.innerHTML = `<tourney-graph></tourney-graph>`;
					this.invitesReceived.innerHTML = "";
				}
			}
			else if (res.ok && data && !data.tournament) {
				console.log("Torneio inactivo");

				this.btnCreateTourneySection.classList.remove("hide");

				this.tourneySection.innerHTML = "";
				this.invitesReceived.innerHTML = "<tourney-invites-received></tourney-invites-received>";

				console.log(this.btnCreateTourneySection);
				console.log(this.tourneySection);
				console.log(this.invitesReceived);
				console.log(this.html);
			}
		});
	}

	#setStateEvent() {
		stateManager.addEvent("tournamentRequestAccepted", (stateValue) => {
			if (stateValue) {
				stateManager.setState("tournamentRequestAccepted", false);
				this.#checkActiveTournamentCall();
			}
		});

		stateManager.addEvent("tournamentAborted",  (stateValue) => {
			if (stateValue) {
				stateManager.setState("tournamentAborted", false);
				this.#checkActiveTournamentCall();
			}
		});
	}
}

customElements.define(PageTournaments.componentName, PageTournaments);
