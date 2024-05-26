
const styles = `

.red {
	border: 1px red solid;
}

.chat {
	display: flex;
}

.friend-list {
	margin-right: 25px;
}

/* Friend List */

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

.chat-panel {
	background-color: #C0C0C0;
	padding: 10px 10px 10px 10px;
	border-radius: 10px;
	overflow-y: scroll;
	height: 80vh;
	width: 100%;
}

.chat-panel .profile-photo {
	width: 45px;
}


.test-msg {
	display: inline-block;
}

.test-msg-date {
	display: flex;
	flex-direction: column;
}

.test-date {
	font-size: 14px;
}

.test-msg-card {
	display: inline-block;
	background-color: #FF5733;
	padding: 5px 8px 5px 8px;
	border-radius: 8px;
	font-size: 16px;
}

.test-img {
	display: inline-block;
}


.test-msg-total1, .test-msg-total2 {
    display: flex;
    flex-direction: row;
    gap: 15px;
    margin-bottom: 20px;
    max-width: 100%;
}

.test-msg-total1 {
    justify-content: flex-start;
}

.test-msg-total2 {
    justify-content: flex-end;
}


.test-msg-total {
	max-width: 80%;
}

.friend-msg-without-photo {
	/* size of profile-photo 45px + gap 15px */
	margin-left: 60px;
}

.own-msg-without-photo {
	/* size of profile-photo 45px + gap 15px */
	margin-right: 60px;
}

`;

const getHtml = function(data) {
	const html = `
	
	<div class="chat">

		<div class="friend-list"></div>

		
		<div class="chat-panel red">
			
			<div class="test-msg-total1">
				<div class="test-img red">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
				</div>
				<div class="test-msg-total red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck</div>
						</div>
					</div>
				</div>
			</div>


			<div class="test-msg-total1">
				<div class="test-msg-total friend-msg-without-photo red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck fatback strip steak, flank capicola chislic bacon shankle. Meatloaf buffalo tri-tip frankfurter, jowl meatball spare ribs ribeye andouille landjaeger doner. Frankfurter ground round burgdoggen beef ribs, biltong pork pancetta cupim pig filet mignon bacon pork belly ball tip bresaola kielbasa. Buffalo ham hock turkey, flank alcatra ground round burgdoggen capicola landjaeger hamburger chuck.</div>
						</div>
					</div>
				</div>
			</div>


			<div class="test-msg-total2 red">
				<div class="test-msg-total red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck</div>
						</div>
					</div>
				</div>
				<div class="test-img red">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
				</div>
			</div>


			<div class="test-msg-total2 red">
				<div class="test-msg-total own-msg-without-photo red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck</div>
						</div>
					</div>
				</div>
			</div>



			<!--#########################-->

			<div class="test-msg-total1">
				<div class="test-img red">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
				</div>
				<div class="test-msg-total red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck</div>
						</div>
					</div>
				</div>
			</div>


			<div class="test-msg-total1">
				<div class="test-msg-total friend-msg-without-photo red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck fatback strip steak, flank capicola chislic bacon shankle. Meatloaf buffalo tri-tip frankfurter, jowl meatball spare ribs ribeye andouille landjaeger doner. Frankfurter ground round burgdoggen beef ribs, biltong pork pancetta cupim pig filet mignon bacon pork belly ball tip bresaola kielbasa. Buffalo ham hock turkey, flank alcatra ground round burgdoggen capicola landjaeger hamburger chuck.</div>
						</div>
					</div>
				</div>
			</div>


			<div class="test-msg-total2 red">
				<div class="test-msg-total red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck</div>
						</div>
					</div>
				</div>
				<div class="test-img red">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
				</div>
			</div>


			<div class="test-msg-total2 red">
				<div class="test-msg-total own-msg-without-photo red">
					<div class="test-msg-date">
						<span class="test-date red">Today 10:34AM</span>
						<div class="test-msg red">
							<div class="test-msg-card">Bacon ipsum dolor amet pastrami chuck</div>
						</div>
					</div>
				</div>
			</div>

			<!--#########################-->


			<br><br>

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
			"id": 8,
			"username": "user",
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
