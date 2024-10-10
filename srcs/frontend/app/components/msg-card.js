import componentSetup from "../utils/componentSetupUtils.js";

const styles = `

.friend-msg, .owner-msg {
	display: flex;
	flex-direction: row;
	gap: 15px;
	margin-bottom: 20px;
	max-width: 100%;
}

.friend-msg {
	justify-content: flex-start;
}

.owner-msg {
	justify-content: flex-end;
}

.profile-photo {
	width: 40px;
}

.msg {
	max-width: 80%;
}

.date-text {
	display: flex;
	flex-direction: column;
}

.msg-date {
	font-size: 14px;
}

.msg-text {
	display: inline-block;
	padding: 5px 8px 5px 8px;
	border-radius: 8px;
	font-size: 16px;
	overflow-wrap: anywhere;
}

.msg-margin-left {
	/* size of profile-photo 45px + gap 15px */
	margin-left: 60px;
}

.msg-margin-right {
	/* size of profile-photo 45px + gap 15px */
	margin-right: 60px;
}

.friend-color {
	background-color: #FF5733;
}

.owner-color {
	background-color: #33FFBD;
}

.msg-date-friend {
	display: flex;
	justify-content: flex-start;
}

.msg-date-owner {
	display: flex;
	justify-content: flex-end;
}
`;

const getHtml = function(data) {

	let senderStyle = "";
	if (data.sender == "friend")
		senderStyle = "friend-msg";
	else
		senderStyle = "owner-msg";

	let photoElm = "";
	if (data.profilePhoto) {
		photoElm = `
			<div>
				<img src="${data.profilePhoto}" class="profile-photo" alt="profile photo chat"/>
			</div>
		`;
	}

	let marginCard = "";
	if (!data.profilePhoto) {
		if (data.sender == "friend")
			marginCard = "msg-margin-left";
		else
			marginCard = "msg-margin-right";
	}

	const html = `
		<div class="${senderStyle}">
			${photoElm && data.sender=='friend' ? photoElm : '' }
			<div class="msg ${marginCard}">
				<div class="date-text">
					<div>
						<span class="msg-date ${data.sender=='friend' ? 'msg-date-friend' : 'msg-date-owner'}">${data.timeDate}</span>
					</div>
					<div class="${data.sender=='friend' ? 'msg-date-friend' : 'msg-date-owner'}">
						<div class="msg-text ${data.sender == 'friend' ? 'friend-color' : 'owner-color'}">${data.message.replaceAll('\n', '<br>')}</div>
					</div>
				</div>
			</div>
			${photoElm && data.sender=='owner' ? photoElm : '' }
		</div>
	`;
	return html;
}

export default class MsgCard extends HTMLElement {
	static observedAttributes = ["sender", "message", "profile-photo", "time-date"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
    }

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "profile-photo")
			name = "profilePhoto";
		if (name == "time-date")
			name = "timeDate";
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {}
}

customElements.define("msg-card", MsgCard);
