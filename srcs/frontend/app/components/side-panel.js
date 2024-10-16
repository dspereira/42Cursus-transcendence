import {redirect} from "../js/router.js";
import stateManager from "../js/StateManager.js";
import {colors} from "../js/globalStyles.js"
import { callAPI } from "../utils/callApiUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";

const styles = `

.hide {
	display: none;
}

.side-panel {
	position: fixed;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	min-height: 500px;
	padding-top: 8px;
	padding-left: 5px;
	padding-right: 5px;
	background-color: ${colors.side_panel_background};
	z-index: 100;
}

.side-panel > nav {
	width: 100%
}

.bottom-buttons {
	position: fixed;
	bottom: 0;
	border-top: 1px ${colors.second_text} solid;
	padding: 10px 0px 10px 0px;
}

button {
	display: block;
	background : transparent;
	border: 0;
	padding: 0;
	text-align: left;
	width: 100%;
}

.list-btn button {
	margin-bottom: 20px;
}

.link-btn button {
	margin-bottom: 10px;
}

.list-btn button:hover {
	background-color: ${colors.btn_default};
	border-radius: 5px;
}

.list-btn {
	width: 52px;
}

.list-btn .icon {
	display: inline-block;
	font-size: 22px;
	padding: 8px 14px 8px 14px;
	text-align: center;
}

.list-btn .icon:hover {
	background-color: ${colors.button_background};
	clip-path:circle();
}

.side-panel button > span {
	display: inline-flex;
	align-items: center;
	gap: 15px;
}

	.notification {
		background: red;
		background: ${colors.btn_alert};
		color: white;
		font-size: 12px;
		font-famyly: inherit;
		font-style: normal;
	}
	
	.notification-circle {
		padding: 0px 6px;
		border-radius: 50%;
	}

	.notification-square {
		padding: 0px 3px;
		border-radius: 3px;
	}

/*** OPEN ***/
.open .side-panel {
	width: 210px;
}

.open .bottom-buttons {
	width: 200px;
}

.open .list-btn button{
	margin-bottom: 12px;
}

.open .link-btn .icon {
	font-size: 22px;
	padding: 3px 14px 3px 14px;
}

.open .link-btn .icon-text {
	font-size: 14px;
}

.open .link-btn button:hover {
	background-color: ${colors.btn_default};
	background: solid;
	border-radius: 5px;
	width: 200px;
}

.icon {
	color: ${colors.primary_text};
}

	/*** CLOSE ***/

.close .side-panel {
	width: auto;
}

.close .list-btn button{
	margin-bottom: 12px;
}

.close #list:hover {
	background-color: ${colors.btn_active};
	background: solid;
	clip-path:circle();
}


.close .link-btn .icon {
	font-size: 22px;
	padding: 3px 14px 3px 14px;
}

.close .link-btn .icon-text {
	font-size: 14px;
	display: none;
}

.icon-text {
	display: flex;
	color: ${colors.primary_text};
	height: 39px;
	align-items: center;
}

.close .link-btn button:hover {
	background-color: transparent;
	background-color: ${colors.btn_default};
	border-radius: 5px;
}

.close .link-btn .icon:hover {
	background-color: ${colors.btn_default};
	border-radius: 5px;
}

.popup-overlay {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(5px);
	justify-content: center; 
	align-items: center;
	z-index: 9999;
}

.popup-content {
	display: flex;
	flex-direction: column;
	background-color: ${colors.second_card};
	color: ${colors.primary_text};
	padding: 20px;
	border-radius: 5px;
	text-align: center;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	width: 30%;
	gap: 10px;
}

.logout-btn, .close-popup {
	margin-top: 15px;
	color: ${colors.primary_text};
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
	text-align: center;
}

.logout-btn {
	background-color: ${colors.btn_alert};
}

.logout-btn:hover {
	background-color: ${colors.btn_alert_hvr};
	color: ${colors.hover_text};
}

.close-popup {
	background-color: ${colors.btn_default};
}

.close-popup:hover {
	background-color: ${colors.btn_hover};
	color: ${colors.hover_text};
}

.btn-container {
	display: flex;
	flex-direction: row;
	gap: 20px;
}

.closePopup:hover {
	color: ${colors.second_text};
}

.logo {
	position: absolute;
	left: 68px;
	top: 13px;
	cursor: pointer;
	width: 120px;
}

.logo-img {
	width: 80px;
	height: auto;
}

.logo-text {
	font-size: 16px;
	color: ${colors.second_text};
}

.list-logo {
	display: flex;
	flex-direction: row;
	gap: 20px;
}

.link-btn {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-y: auto;
}

.hide {
	display: none;
}

@media (max-height: 500px) {
	.side-panel {
		height: 100px;
		overflow-y: auto;
	}

	.btn-container {
		display: flex;
		flex-direction: column;
		height: 800px;
	}

	.bottom-buttons {
		/*top: 380px;*/
		position: static;
		bottom: 0px;
	}
}

	.icon {
		position: relative;
	}

	.open .notification {
		position: absolute;
		top: -2px;
		right: 0px;
	}

	.close .notification {
		position: absolute;
		top: -2px;
		right: 0px;
	}
`;

const getHtml = function(data) {
	const html = ` 
	<div class="logout-popup popup-overlay">
			<div class="popup-content">
			<h2>Logout from BlitzPong</h2>
			<div class="btn-container">
				<button class="close-popup">Close</button>
				<button class="logout-btn">Logout</button>
			</div>
		</div>
	</div>
	<div class="side-panel-wrapper ${data.state}">
		<aside class="side-panel">
			<nav>
				<div class="list-btn">
					<button>
						<span>
							<i class="icon bi bi-list"></i>
						</span>
					</button>
				</div>
				<div class= "logo">
					<img src="/img/pong-150.png" class="logo-img" alt="logo">
					<span class="logo-text"><strong></strong></span>
				</div>
				<div class="btn-container">
					<div class="link-btn">
						<button id="home">
							<span>
								<i class="icon bi bi-house-door"></i>
								<span class="icon-text">Home</span>
							</span>
						</button>
						<button id="chat">
							<span>
								<i class="icon bi bi-chat"></i>
								<span class="icon-text">Chat</span>
							</span>
						</button>
						<button id="tournaments">
							<span>
								<i class="icon bi bi-trophy">
									<span class="tournaments-notifications notification"></span>
								</i>
								<span class="icon-text">Tournaments</span>
							</span>
						</button>
						<button id="friends">
							<span>
								<i class="icon bi bi-people">
									<span class="friends-notifications notification"></span>
								</i>
								<span class="icon-text">Friends</span>
							</span>
						</button>
						<button id="play">
							<span>
								<i class="icon bi bi-dpad">
									<span class="game-notifications notification"></span>
								</i>
								<span class="icon-text">Play</span>
							</span>
						</button>
						<div class="bottom-buttons">
							<button id="logout">
								<span>
									<i class="icon bi bi-power"></i>
									<span class="icon-text">Logout</span>
								</span>
							</button>
							<button id="configurations">
								<span>
									<i class="icon bi bi-gear"></i>
									<span class="icon-text">Configurations</span>
								</span>
							</button>
						</div>
					</div>
				</div>
			<nav>
		</aside>
	</div>
	`;
	return html;
}

// Can be changed to object key:value
// key -> id element   value -> pretended route
const navigation = [
	"home",
	"chat",
	"tournaments",
	"logout",
	"configurations",
	"friends",
	"play"
]

const selectedIcon  = {
	home: "bi-house-door-fill",
	chat: "bi-chat-fill",
	tournaments: "bi-trophy-fill",
	configurations: "bi-gear-fill",
	friends: "bi-people-fill",
	play: "bi-dpad-fill"
}

const deselectedIcon = {
	home: "bi-house-door",
	chat: "bi-chat",
	tournaments: "bi-trophy",
	configurations: "bi-gear",
	friends: "bi-people",
	play: "bi-dpad"
}

export default class SidePanel extends HTMLElement {
	static observedAttributes = ["selected", "state"];

	constructor() {
		super()
		this.#initComponent();
		this.intervalID = null;
		this.#scripts();
		this.lastState = "open";
		this.escClose = () => {
			const popup = document.querySelector('.logout-popup');
			if (popup)
				popup.style.display = "none";
			document.removeEventListener('keydown', this.escClose);
		};
	}

	disconnectedCallback() {
		if (this.intervalID) {
			clearInterval(this.intervalID);
		}
	}

	disconnectedCallback() {
		if (this.intervalID) {
			clearInterval(this.intervalID);
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "selected")
			this.#changeSelectedPage(oldValue, newValue);
		else if (name === "state")
			this.#changeState(newValue);
	}
	#initComponent() {
		this.html = componentSetup(this, getHtml({state: stateManager.getState("sidePanel")}), styles);

		this.gameNotifications = this.html.querySelector(".game-notifications");
		this.tournamentNotifications = this.html.querySelector(".tournaments-notifications");
		this.friendsNotifications = this.html.querySelector(".friends-notifications");
	}

	#scripts() {
		this.#openClosePanel();
		this.#setupNavigationEvents();
		this.#addPageRedirection("profile", "logo");
		this.#responsiveSidePanel();
		this.#getNumberRequestsCallApi();
		this.#startInvitesPolling();
	}

	#startInvitesPolling(){
		this.intervalID = setInterval(() => {
			if (!stateManager.getState("isOnline"))
				return ;
			this.#getNumberRequestsCallApi();
		}, 5000);
	}

	#getNumberRequestsCallApi(){
		callAPI("GET", "/notifications/requests-notifications/", null, (res, data) => {
			if (res.ok && data) {
				this.#updateNotifications(this.gameNotifications, data.number_game_requests);
				this.#updateNotifications(this.tournamentNotifications, data.number_tournament_requests);
				this.#updateNotifications(this.friendsNotifications, data.number_friend_requests);
				stateManager.setState("hasFriendInvite", data.number_friend_requests);
			}
		});
	}

	#updateNotifications(elm, nbr_notifications) {
		elm.innerHTML = `${nbr_notifications}`;
		if (nbr_notifications) {
			elm.classList.remove("hide");
			elm.classList.remove("notification-circle");
			elm.classList.remove("notification-square");
			if (nbr_notifications <= 9)
				elm.classList.add("notification-circle");
			else
				elm.classList.add("notification-square");
		}
		else
			elm.classList.add("hide");
	}

	//btnOpenClose()
	// criar uma função só de abrir e uma de fechar DRY principle
	#openClosePanel() {
		let btn = this.html.querySelector(`.list-btn > button`);
		btn.addEventListener("click", () => {
			let sidePanel = this.html.querySelector(".side-panel-wrapper");
			const logo = this.html.querySelector(".logo");
			sidePanel.classList.toggle("close");
			sidePanel.classList.toggle("open");
			if (sidePanel.classList.contains("close"))
			{
				stateManager.setState("sidePanel", "close");
				this.lastState = "close";
				// logo.classList.add("hide");
			}
			else
			{
				logo.classList.remove("hide");
				stateManager.setState("sidePanel", "open");
				this.lastState = "open";
			}
		});
	}

	#addButtonClickEvent(btnId) {
		let btn = this.html.querySelector(`#${btnId}`);
		btn.addEventListener("click", () => {
			if (btnId == "logout")
			{
				const popup = document.querySelector('.logout-popup');
				popup.style.display = 'flex';
				document.addEventListener('keydown', this.escClose);
				this.#logOutPopUp();
				return ;
			}
			if (btnId === "home")
				btnId = "/";
			redirect(btnId);
		});
	}

	#setupNavigationEvents() {
		navigation.forEach((elem) => {
			this.#addButtonClickEvent(elem);
		})
	}

	#changeSelectedPage(oldValue, newValue) {		
		const newPage = navigation.find((elem) => elem === newValue);
		const oldPage = navigation.find((elem) => elem === oldValue);
		if (newPage === oldPage)
			return ;
		if (newPage)
			this.#changeIcon(newPage, deselectedIcon[newPage], selectedIcon[newPage]);
		if (oldPage)
			this.#changeIcon(oldPage, selectedIcon[newPage], deselectedIcon[newPage]);
	}

	#changeIcon(page, oldIconClass, newIconClass) {
		const icon = this.html.querySelector(`#${page} .icon`);
		icon.classList.remove(oldIconClass);
		icon.classList.add(newIconClass);
	}
	
	#changeState(value) {
		if (value !== "close" && value !== "open")
			return ;
		const sidePanel = this.html.querySelector(".side-panel-wrapper");
		sidePanel.classList.remove("close");
		sidePanel.classList.remove("open");
		sidePanel.classList.add(value);
		stateManager.setState("sidePanel", value);
	}

	#logOutPopUp() {
		const popup = document.querySelector('.logout-popup');
		const closePopupButton = document.querySelector('.close-popup');
		closePopupButton.addEventListener('click', () => {
			popup.style.display = 'none';
			document.removeEventListener('keydown',this.escClose);
		});

		window.addEventListener('click', (event) => {
			if (event.target === popup) {
				popup.style.display = 'none';
				document.removeEventListener('keydown', this.escClose);
			}
		});
		this.#logoutEvent();
	}

	#apiResHandlerCalback(res, data) {
		if (data.ok && res.message === "success") {
			if (stateManager.getState("isLoggedIn", true))
				stateManager.setState("isLoggedIn", false);
		}
		else {
			redirect("/");
		}
	}

	#logoutEvent() {
		const logout = this.html.querySelector(".logout-btn");	
		logout.addEventListener("click", (event) => {
			callAPI("POST", "/auth/logout", null, this.#apiResHandlerCalback, null, getCsrfToken());
		});
	}

	#addPageRedirection(page, classIdentifier) {
		const elm = this.html.querySelector(`.${classIdentifier}`);
		if (!elm)
			return ;
		if (page === "/home" || page === "home")
			page = "";
		elm.addEventListener("click", () => redirect(`/${page}`));
	}

	#openSidePanel() {
		let sidePanel = this.html.querySelector(".side-panel-wrapper");
		if (this.lastState == "close")
			return ;
		if (sidePanel.classList.contains("close"))
		{
			if (this.lastState == "close")
				this.lastState = "close";
			sidePanel.classList.remove("close");
		}
		sidePanel.classList.add("open");
		stateManager.setState("sidePanel", "open");
	}

	#closeSidePanel() {
		let sidePanel = this.html.querySelector(".side-panel-wrapper");
		if (sidePanel.classList.contains("open"))
		{
			sidePanel.classList.remove("open");
		}
		sidePanel.classList.add("close");
		stateManager.setState("sidePanel", "close");
	}

	#responsiveSidePanel() {
		const mediaQuery = window.matchMedia('(max-width: 1000px)');
		mediaQuery.addEventListener('change', () => {
			if (mediaQuery.matches)
				this.#closeSidePanel();
			else
				this.#openSidePanel();
		});
		if (mediaQuery.matches)
			this.#closeSidePanel();
		else
			this.#openSidePanel();
	}
}

customElements.define("side-panel", SidePanel);