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
	width: 45px;
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
			<div class="test-img">
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
						<span class="msg-date ${data.sender=='friend' ? 'msg-date-friend' : 'msg-date-owner'}">Today 10:34AM</span>
					</div>
					<div class="${data.sender=='friend' ? 'msg-date-friend' : 'msg-date-owner'}">
						<div class="msg-text ${data.sender == 'friend' ? 'friend-color' : 'owner-color'}">${data.message}</div>
					</div>
				</div>
			</div>
			${photoElm && data.sender=='owner' ? photoElm : '' }
		</div>
	`;
	return html;
}

export default class MsgCard extends HTMLElement {
	static observedAttributes = ["sender", "message", "profile-photo", "timestamp"];

	constructor() {
		super()
		this.data = {};
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
	
	}
}

customElements.define("msg-card", MsgCard);


