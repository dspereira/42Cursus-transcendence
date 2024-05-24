
const styles = `

.chat {
	display: flex;
}

.friend-list {
	margin-right: 25px;
}

/* Friend List */

.red {
	border: 1px red solid;
}

.user {
	display: flex;
	cursor: pointer;
	align-items: center;
	gap: 10px;
	margin-bottom: 20px;
}

.user .profile-photo {
	width: 40px;
	height: auto;
	clip-path:circle();
}

.user .name {
	font-size: 16px;
	font-weight: bold;
}


/* Chat panel */

.chat-panel .profile-photo {
	width: 45px;
}

.msg {
	margin-bottom: 20px;	
}

.card-msg {
	display: block;
	max-width: 70%;
}

.card-text {
	margin-top:30px;
	padding: 5px 8px 5px 8px;
	border-radius: 8px; 
}

.card-text-margin-friend {
	margin-left: 65px;
}

.card-text-margin-own {
	margin-right: 65px;
}

.friend-color {
	background-color: #FF5733;
}

.own-color {
	background-color: #33FFBD;
}


.friend-pos {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 15px;
}

.own-pos {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	gap: 15px;
}


.name-date-friend {
	position: absolute;
	margin-top: 4px;
	margin-left: 65px;
}

.name-date-own {
	position: absolute;
	margin-top: 4px;

	/* size of profile-photo 50px + gap 15px */
	margin-right: 65px;
}

`;

const getHtml = function(data) {
	const html = `
	
	<div class="chat">

		<div class="friend-list"></div>

		
		<div class="chat-panel">

			<div class="msg friend-pos">

				<div class="name-date-friend">
					<span>dsilveri Today 10:34AM</span>
				</div>
				<div>
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
				</div>
				<div class="card-msg">
					<div class="friend-color card-text">Bacon ipsum dolor amet bresaola beef tongue, burgdoggen flank brisket ham meatloaf pastrami chislic. Bresaola shoulder alcatra frankfurter leberkas boudin capicola. Meatball buffalo swine cow, ham hock short loin ball tip fatback pancetta landjaeger pork loin kevin drumstick shank.</div>
				</div>
			</div>

			<div class="msg friend-pos">

				<div class="name-date-friend">
					<span>dsilveri Today 10:34AM</span>
				</div>
				<div class="card-msg card-text-margin-friend">
					<div class="friend-color card-text">oi</div>
				</div>
			</div>

			<div class="msg own-pos">
				<div class="name-date-own">
				<span>dsilveri Today 10:34AM</span>
				</div>
				<div class="card-msg">
					<div class="own-color card-text">Bacon ipsum dolor amet bresaola beef tongue, burgdoggen flank brisket ham meatloaf pastrami chislic. Bresaola shoulder alcatra frankfurter leberkas boudin capicola. Meatball buffalo swine cow, ham hock short loin ball tip fatback pancetta landjaeger pork loin kevin drumstick shank. </div>
				</div>
				<div>
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
				</div>
			</div>


			<div class="msg own-pos">
				<div class="name-date-own">
					<span>dsilveri Today 10:34AM</span>
				</div>
				<div class="card-msg card-text-margin-own">
					<div class="own-color card-text">Bacon ipsum dolor amet bresaola beef tongue</div>
				</div>
			</div>

			<form id="chat-form">
				<textarea id="message" placeholder="Type a message here.." maxlength="256"></textarea>
				<button type="submit">Send</button>
			</form>

		</div>

	</div>

	`;
	return html;
}

export default class AppChat extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

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
	}

	#scripts() {
		const friendList = getFriendsFakeCall();

		this.#createFriendListHtml(friendList);

	}

	#socket() {
		let chatSocket = null;
		const result_str = "ws://127.0.0.1:8000/chat_connection/?room_id=1";
		chatSocket = new WebSocket(result_str);

		chatSocket.onopen = function(event) {
			console.log("Successfully connected to the WebSocket.");
		}

		chatSocket.onclose = function(event) {

			console.log("Fecha ligação");

			chatSocket = null;

		};


		const chatForm = this.html.querySelector("#chat-form");
		chatForm.addEventListener("submit", (event) => {
			event.preventDefault();

			let msgField = document.querySelector('#message');
			msgField.value.trim();

			let message = document.querySelector('#message').value.trim();
			if (message)
			{
				chatSocket.send(JSON.stringify({
					"message": message,
				}))

				console.log(chatSocket);

			}
			msgField.innerHTML = "";

		});

		chatSocket.onmessage = function(event) {
			const data = JSON.parse(event.data);
			console.log(data);
		};

		chatSocket.onerror = function(err) {
			console.log("WebSocket encountered an error: " + err.message);
			console.log("Closing the socket.");
			chatSocket.close();
		}
	}

	#createFriendListHtml(friendList) {
		const friendListHtml = this.html.querySelector(".friend-list");
		friendList.forEach((friendObj) => {
			friendListHtml.appendChild(this.#getFriendHtml(friendObj));
		})
	}

	#getFriendHtml(friendObj) {
		const elm = document.createElement("div");
		elm.classList.add("user");
		if (friendObj) {
			elm.innerHTML = `
			<img src="${friendObj.image}" class="profile-photo" alt="profile photo chat"/>
			<span class="name">${friendObj.username}</span>`;
		}
		return elm;
	}
}

customElements.define("app-chat", AppChat);


// just for debug
const getFriendsFakeCall = function ()
{
	const data = `[
		{
			"id": 7,
			"username": "candeia1",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 1,
			"username": "candeia2",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 2,
			"username": "candeia3",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		},
		{
			"id": 3,
			"username": "candeia4",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia"
		}
	]`;

	return JSON.parse(data);
}
