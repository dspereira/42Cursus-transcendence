import {redirect} from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import {colors} from "../js/globalStyles.js";

const styles = `

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
		flex-wrap: wrap;
		gap: 40px;
		justify-content: center;
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

	.tourn-title-input input {
		padding-left: 40px;
	}

	.tourn-title-input .form-group {
		display: flex;
	}

	.tourn-title-input {
		width: 300px;
		margin-bottom: 25px;
	}
	
	.tourn-sep {
		display: flex;
		width: 100%;
		height: 100px;
		justify-content: center;
		align-items: center;
	}

	.tourn-name, .tourn-inv-inner {
		color: ${colors.second_text}
	}

	 .tourn-p-card, .tourn-inv-time {
		color: ${colors.third_text}
	}

	.box-off, .tourn-card, .tourn-inv {
		background-color: ${colors.main_card};
	}

	.tourn-name, .tourn-p-card {
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
	`;
	return html;
}

export default class CurrentTournament extends HTMLElement {

	constructor() {
		super()
		this.tournInfo = getFakeActiveTourn();
		this.#initComponent();
		this.#render();
		this.#scripts();
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
	}

	#scripts() {
		this.#initHtml();
	}

	#initHtml() {
		this.html.innerHTML =  `
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
			<div class=tourn-sep>
				<div class=separator></div>
			</div>
			<div class=tourn-inv-box>
				<div class="tourn-inv">
					<div class=tourn-inv-inner>
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p2}" class="tourn-p-img"></img>
						${this.tournInfo.p2}
					</div>
					<div class=separator-v></div>
					<div class=tourn-inv-inner>
						<div class=tourn-inv-status>Status</div>
						<div class=tourn-inv-time>Elapsed<br>Time</div>
					</div>
				</div>
				<div class="tourn-inv">
					<div class=tourn-inv-inner>
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p3}" class="tourn-p-img"></img>
						${this.tournInfo.p3}
					</div>
					<div class=separator-v></div>
					<div class=tourn-inv-inner>
						<div class=tourn-inv-status>Status</div>
						<div class=tourn-inv-time>Elapsed<br>Time</div>
					</div>
				</div>
				<div class="tourn-inv">
					<div class=tourn-inv-inner>
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=${this.tournInfo.p4}" class="tourn-p-img"></img>
						${this.tournInfo.p4}
					</div>
					<div class=separator-v></div>
					<div class=tourn-inv-inner>
						<div class=tourn-inv-status>Status</div>
						<div class=tourn-inv-time>Elapsed<br>Time</div>
					</div>
				</div>
			</div>
		</div>
	`;
	}
}
customElements.define("current-tournament", CurrentTournament);

const getFakeActiveTourn = function () {
	const data = `{
		"name": "Manga's Tourn",
		"inTourn": "false",
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
