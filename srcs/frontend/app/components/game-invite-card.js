import { callAPI } from "../utils/callApiUtils.js";

const styles = `

.invite-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #EEEDEB;
	margin-left: 150px;
	margin-right: 150px;
	padding: 10px 20px 10px 20px;
	border-radius: 8px;

	margin-bottom: 15px;
}

.user-photo{
	width: 60px;
}

.username {
	font-size: 20px;
	font-weight: bold;
	margin-left: 10px;
}

.join-btn {
	width: 100px;
	height: 40px;

	/*padding-left: 30px;
	padding-right: 30px;*/

}

.decline-btn {
	width: 40px;
	height: 40px;
}


.btn-test {
	display: flex;
	gap: 50px;
	align-items: center;
}

/****************************************/

.test {
	display: inline-block;
	background-color: #EEEDEB;
	border-radius: 8px;
	padding: 20px 30px 20px 30px;
}

.invite-card1 {
	display: flex;
	flex-direction: column;
	justify-content: center;
	/*gap: 10px;*/
	align-items: center;
	/*background-color: #EEEDEB;
	margin-left: 150px;
	margin-right: 150px;
	padding: 10px 20px 10px 20px;
	border-radius: 8px;*/
	/*width: 200px*/


}

.join-btn1 {
	margin-right: 3px;
	
}

.username1 {
	font-size: 22px;
	font-weight: bold;
	
}

.username-div {
	margin-bottom: 15px;
}

.user-photo1 {
	width: 70px;
}

.expires {
	margin-bottom: 5px;
}

.date {
	font-size: 18px;
}

.cont {

	display: flex;
	justify-content: space-evenly;

	margin-left: 150px;
	margin-right: 150px;
}
`;

const getHtml = function(data) {
	const html = `
	<div class="invite-card">
		<div class="user">
			<img src="${data.profilePhoto}" class="user-photo" alt="profile photo chat"/>
			<span class="username">${data.username}</span>
		</div>
		
		<div>
			<span class="date">Today 11:16AM</span>
		</div>
		
		<div class="buttons">
			<button type="button" class="btn btn-success join-btn">
				Join
			</button>
			<button type="button" class="btn btn-danger decline-btn">
				<i class="bi bi-x-lg"></i>
			</button>
		</div>
	</div>

	<div class="invite-card">
		<div class="user">
			<img src="${data.profilePhoto}" class="user-photo" alt="profile photo chat"/>
			<span class="username">${data.username}</span>
		</div>
		
		<div>
			<span class="date">Today 11:16AM</span>
		</div>
		
		<div class="buttons">
			<button type="button" class="btn btn-success join-btn">
				Join
			</button>
			<button type="button" class="btn btn-danger decline-btn">
				<i class="bi bi-x-lg"></i>
			</button>
		</div>
	</div>

	<br><br><br>


	<div class="invite-card">
		<div class="user">
			<img src="${data.profilePhoto}" class="user-photo" alt="profile photo"/>
			<span class="username">${data.username}</span>
		</div>
		

		
		<div class="buttons btn-test">
			<div>
				<span class="date">Today 11:16AM</span>
			</div>
			<div>
				<button type="button" class="btn btn-success join-btn">
					Join
				</button>
				<button type="button" class="btn btn-danger decline-btn">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
	</div>

		<div class="invite-card">
		<div class="user">
			<img src="${data.profilePhoto}" class="user-photo" alt="profile photo"/>
			<span class="username">${data.username}</span>
		</div>
		

		
		<div class="buttons btn-test">
			<div>
				<span class="date">Today 11:16AM</span>
			</div>
			<div>
				<button type="button" class="btn btn-success join-btn">
					Join
				</button>
				<button type="button" class="btn btn-danger decline-btn">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
	</div>

	<br><br><br>


	<div class="invite-card">
		<div>
			<button type="button" class="btn btn-success join-btn">Join</button>
		</div>

		<div class="user">
			<img src="${data.profilePhoto}" class="user-photo" alt="profile photo chat"/>
			<span class="username">${data.username}</span>
		</div>

		<div>
			<span class="date">Today 11:16AM</span>
		</div>

		<div>
			<button type="button" class="btn btn-danger decline-btn">
				<i class="bi bi-x-lg"></i>
			</button>
		</div>
	</div>

	<div class="invite-card">
		<div>
			<button type="button" class="btn btn-success join-btn">Join</button>
		</div>

		<div class="user">
			<img src="${data.profilePhoto}" class="user-photo" alt="profile photo chat"/>
			<span class="username">${data.username}</span>
		</div>

		<div>
			<span class="date">Today 11:16AM</span>
		</div>

		<div>
			<button type="button" class="btn btn-danger decline-btn">
				<i class="bi bi-x-lg"></i>
			</button>
		</div>
	</div>

	<br><br><br>

	<div class="cont">

	<div class="test">
		<div class="invite-card1">
			<div class="user">
				<img src="${data.profilePhoto}" class="user-photo1" alt="profile photo chat"/>
			</div>

			<div class="username-div">
				<span class="username1">${data.username}</span>
			</div>
			
			<div class="expires">
				<span class="date">Today 11:16AM</span>
			</div>
			
			<div class="buttons">
				<button type="button" class="btn btn-success join-btn join-btn1">
					Join
				</button>
				<button type="button" class="btn btn-danger decline-btn">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
	</div>


	<div class="test">
		<div class="invite-card1">
			<div class="user">
				<img src="${data.profilePhoto}" class="user-photo1" alt="profile photo chat"/>
			</div>

			<div class="username-div">
				<span class="username1">${data.username}</span>
			</div>
			
			<div class="expires">
				<span class="date">Today 11:16AM</span>
			</div>
			
			<div class="buttons">
				<button type="button" class="btn btn-success join-btn join-btn1">
					Join
				</button>
				<button type="button" class="btn btn-danger decline-btn">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
	</div>

	<div class="test">
		<div class="invite-card1">
			<div class="user">
				<img src="${data.profilePhoto}" class="user-photo1" alt="profile photo chat"/>
			</div>

			<div class="username-div">
				<span class="username1">${data.username}</span>
			</div>
			
			<div class="expires">
				<span class="date">Today 11:16AM</span>
			</div>
			
			<div class="buttons">
				<button type="button" class="btn btn-success join-btn join-btn1">
					Join
				</button>
				<button type="button" class="btn btn-danger decline-btn">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
	</div>

	<div class="test">
		<div class="invite-card1">
			<div class="user">
				<img src="${data.profilePhoto}" class="user-photo1" alt="profile photo chat"/>
			</div>

			<div class="username-div">
				<span class="username1">${data.username}</span>
			</div>
			
			<div class="expires">
				<span class="date">Today 11:16AM</span>
			</div>
			
			<div class="buttons">
				<button type="button" class="btn btn-success join-btn join-btn1">
					Join
				</button>
				<button type="button" class="btn btn-danger decline-btn">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>
		</div>
	</div>	


	</div>

	`;
	return html;
}

export default class GameInviteCard extends HTMLElement {
	static observedAttributes = ["username", "profile-photo"];

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

customElements.define("game-invite-card", GameInviteCard);
