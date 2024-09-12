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

.exit-tourney {
	display: flex;
	justify-content: center;
	align-items: center;
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
		<div class="btn-create-tourney-section hide">
			<div class="create-tourney">
				<button type="button" class="btn btn-primary btn-create-tourney">Create Tornement</button>
			</div>
			<div class="border-separation"></div>
		</div>
		<div class="tourney-section"></div>
		<div class="invites-received"></div>
		<div class="exit-tourney hide"><button type="button" class="btn btn-primary btn-exit-tourney">Exit Tournament</button></div>
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
		this.exitTournament = this.html.querySelector(".exit-tourney");
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
		this.#setExitTtourneyBtn();
	}

	#createTournamentEvent() {
		const btn = this.html.querySelector(".btn-create-tourney");
		btn.addEventListener("click", () => {
			callAPI("POST", `http://127.0.0.1:8000/api/tournament/`, null, (res, data) => {					
				if (res.ok && data && data.tournament_info) {
					const info = data.tournament_info;
					stateManager.setState("tournamentId", info.id);
					this.btnCreateTourneySection.classList.add("hide");
					this.tourneySection.innerHTML = `
					<tourney-lobby
						tournament-id="${info.id}"
						owner-id="${stateManager.getState("userId")}"
						tournament-name="${info.name}"
					></tourney-lobby>`;
					this.invitesReceived.innerHTML = "";
				}
			});
		});
	}

	#checkActiveTournamentCall() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/active-tournament/`, null, (res, data) => {
			if (res.ok && data && data.tournament) {
				const torneyData = data.tournament;
				stateManager.setState("tournamentId", torneyData.id);
				this.btnCreateTourneySection.classList.add("hide");
				this.exitTournament.classList.add("hide");
				if (torneyData.status == "created") {
					this.tourneySection.innerHTML = `
					<tourney-lobby
						tournament-id="${torneyData.id}"
						owner-id="${torneyData.owner}"
						tournament-name="${torneyData.name}"
					></tourney-lobby>`;
					this.invitesReceived.innerHTML = "";
				}
				else if (torneyData.status == "active") {
					this.tourneySection.innerHTML = `<tourney-graph tournament-id="${torneyData.id}" tournament-name="${torneyData.name}"></tourney-graph>`;
					this.invitesReceived.innerHTML = "";
				}
			}
			else if (res.ok && data && !data.tournament) {
				this.btnCreateTourneySection.classList.remove("hide");
				this.exitTournament.classList.add("hide");
				this.tourneySection.innerHTML = "";
				this.invitesReceived.innerHTML = "<tourney-invites-received></tourney-invites-received>";
			}
		});

		const tournamentId = stateManager.getState("tournamentId");
		if (tournamentId)
			this.#checkTournamentFinished(tournamentId);
	}

	#setStateEvent() {
		stateManager.addEvent("isTournamentChanged", (stateValue) => {
			if (stateValue) {
				this.#checkActiveTournamentCall();
				stateManager.setState("isTournamentChanged", false);
			}
		});

		stateManager.addEvent("tournamentGameLobby", (stateValue) => {
			if (stateValue) {
				this.btnCreateTourneySection.classList.add("hide");
				this.tourneySection.innerHTML = `<app-lobby 
					lobby-id=${stateValue} 
					is-tournament="true"
				></app-lobby>`;
				this.invitesReceived.innerHTML = "";		
				stateManager.setState("tournamentGameLobby", null);
			}
		});
	}

	#checkTournamentFinished(tournamentId) {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/is-finished/?id=${tournamentId}`, null, (res, data) => {
			if (res.ok && data && data.is_finished) {
				this.btnCreateTourneySection.classList.add("hide");
				this.tourneySection.innerHTML = `<tourney-graph tournament-id="${tournamentId}" tournament-name="${data.tournament_name}"></tourney-graph>`;
				this.invitesReceived.innerHTML = "";
				this.exitTournament.classList.remove("hide");
			}
		});
	}

	#setExitTtourneyBtn() {
		const btn = this.html.querySelector(".btn-exit-tourney");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			stateManager.setState("tournamentId", null);
			stateManager.setState("isTournamentChanged", true);
		});
	}
}

customElements.define(PageTournaments.componentName, PageTournaments);


