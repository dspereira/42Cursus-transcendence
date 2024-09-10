import {callAPI} from "../utils/callApiUtils.js";

const styles = `
.main-container {
	display: flex;
	gap: 10px;
	width: 100%;
}

.general-settings-container {
	width: 70%;
	/*background-color: red;*/
}

.image-settings-container {
	dispay: flex;
	flex-direction: column; 	
	justify-content: center;
	width: 30%;

	/*background-color: blue;*/
}

.img-container {
	display: flex;
	justify-content: center;
}

.image-preview {
	width: 100%;
	height: auto;
	clip-path:circle();
	max-width: 300px;
}

.img-buttons {
	display: flex;
	justify-content: center;
	width: 100%;
	gap: 2%;
}

.btn-img {
	width: 50%;
	max-width: 150px;
	font-size: clamp(0.5rem, 1vw, 1rem);
}

legend {
	font-size: 16px
}


`;

const getHtml = function(data) {
	const html = `
	<form id="settings-form">
		<div class="main-container">
			<div class="general-settings-container">
				<h2>Profile Settings</h2>
				<hr>
				<label for="new-username">Change Username</label>
				<input type="text" class="input-padding form-control form-control-md" id="new-username" placeholder="New Username" maxlength="15">
				<label for="new-bio">Change Bio</label>
				<textarea type="text" class="input-padding form-control form-control-md" id="new-bio" placeholder="New Bio" rows="3" maxlength="255"></textarea>

				<h2>Scurity Settings</h2>
				<hr>
				<fieldset>
					<legend>Choose where to receive your two-factor authentication:</legend>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="qrcode" id="qrcode">
						<label class="form-check-label" for="qrcode">
							QR Code
						</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="email" id="email">
						<label class="form-check-label" for="email">
							Email
						</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="phone" id="phone">
						<label class="form-check-label" for="phone">
							Phone
						</label>
					</div>
				</fieldset>

				<h2>Game Settings</h2>
				<hr>
				<label for="theme-options">Choose the game theme:</label>
				<select class="form-select" id="theme-options" aria-label="Game theme selection">
					<option value="0" selected>Classic Retro</option>
					<option value="1">Modern Neon</option>
					<option value="2">Ocean Vibes</option>
					<option value="3">Sunset Glow</option>
					<option value="4">Forest Retreat</option>
				</select>
			
				<h2>Language Settings</h2>
				<hr>
				<label for="language-option">Choose language:</label>
				<select name="language" id="language-option">
					<option value="en">English &#x1F1EC;&#x1F1E7;</option>
					<option value="pt">Português &#x1F1F5;&#x1F1F9;</option>
					<option value="es">Espanhol &#x1F1EA;&#x1F1F8;</option>
				</select>

				<div><button type="submit" class="btn btn-primary btn-submit">Apply Changes</button></div>
			</div>

			<div class="image-settings-container">
				<div class="img-container">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=7weil" class="image-preview" alt="Preview of the Image to be Changed">
				</div>
				<div class="img-buttons">
					<button class="btn btn-primary btn-img">Upload Image</button>
					<button class="btn btn-primary btn-img">New Avatar</button>
				</div>
			</div>
		</div>
	</form>
	`;
	return html;
}

export default class AppConfigs extends HTMLElement {
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
		this.usernameInp = this.html.querySelector("#new-username");
		this.bioInp = this.html.querySelector("#new-bio");
		this.gameThemeOption = this.html.querySelector("#theme-options");
		this.languageOption = this.html.querySelector("#language-option");
		this.imagePreview = this.html.querySelector(".image-preview");
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
		this.#submit();
		this.#getUserSettings();
	}

	#submit() {
		const settingsForm = this.html.querySelector("#settings-form");

		settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();
		

		});
	}

	#getUserSettings() {
		callAPI("GET", "http://127.0.0.1:8000/api/settings/", null, (res, resData) => {
			if (res.ok && resData && resData.settings)
				this.#loadData(resData.settings);
		});
	}

	#loadData(data) {
		this.usernameInp.value = data.username;
		this.bioInp.value = data.bio;
		this.gameThemeOption.value = data.game_theme;
		this.languageOption.value = data.language;
		this.imagePreview.setAttribute("src", data.image);
	}
}

customElements.define("app-configs", AppConfigs);