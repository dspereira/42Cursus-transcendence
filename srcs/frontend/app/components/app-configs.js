import {redirect} from "../js/router.js";
import {callAPI} from "../utils/callApiUtils.js";

const styles = `

	.configs-container {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;
	}

	.configs-container h1 {
		font-size: 36px;
	}

	.text-configs {
		display: flex;
		flex-direction: column;
		width: 50%;
	}

	.hide {
		display: none;
	}

	.show {
		display: block;
	}

	#new-username {
		margin-bottom: 30px;
	}

	.image-configs{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20px;
		margin-right: 12.5%;
	}

	.image-buttons {
		display: flex;
		justify-content: center;
		gap: 15px;
		margin-top: 10px;
	}

	.input-image-icon {
		font-size: 50px;
		cursor: pointer;
	}

	.image-button {
		height: 50px;
	}

	.uploadText {
		margin-top: 5px;
	}

	.non-profile-configs {
		display: flex;
		gap: 25%;
		margin-top: 30px;
	}

	.two-factor-configs h1 {
		font-size: 36px;
	}

	.two-factor-options {
		display: flex;
	}

	.two-factor-options label {
		margin-left: 5px;
		margin-right: 20px;
	}

	.game-configs {
		margin-top: 40px;
	}

	.language-configs h1 {
		font-size: 36px;
		margin-top:40px;
	}

	.submit-options {
		margin-top: 30px;
	}
`;

const getHtml = function(data) {
	const html = `
		<form id="settings-form">
			<div class="configs-container">
				<div class="text-configs">
					<h1>Profile Settings</h1>
					<hr>
					<label for="new-username">Change Username</label>
					<div class="alert alert-danger username-error-message hide" role="alert">
						Username already in use.
					</div>
					<input type="text" class="input-padding form-control form-control-lg" id="new-username" placeholder="New Username" maxlength="50">
					<label for="new-bio">Change Bio</label>
					<textarea type="text" class="input-padding form-control form-control-lg" id="new-bio" placeholder="New Bio" rows="3" maxlength="255"></textarea>
				</div>
				<div class="image-configs">
					<img class="image-preview" style="width: 300px; height: 300px; clip-path: circle();">
					<div class="image-buttons">
						<label for="newImage" class="btn btn-secondary image-button">
							<p class="uploadText">Upload Image</p>
						</label>
						<input id="newImage" type="file" accept="image/*" id="image-input" style="display: none;">
						<button id="seedButton" class="btn btn-secondary image-button">Generate New Avatar</button>
					</div>
				</div>
			</div>
			<div class="non-profile-configs">
				<div>
					<div class="two-factor-configs">
						<h1>Security Settings</h1>
						<hr>
						<label for="two-factor-options">Choose where to recieve your two factor authentication:</label>
						<div class="two-factor-options">
							<input type="checkbox" id="qrcode" name="2FAOptions" />
							<label for="qrcode">QR Code</label>
							<input type="checkbox" id="email" name="2FAOptions" />
							<label for="email">Email</label>
							<input type="checkbox" id="phone" name="2FAOptions" />
							<label for="phone">Phone</label>
						</div>
					</div>
					<div class="game-configs">
						<h1>Game Settings</h1>
						<hr>
						<label for="theme-options">Choose the game theme:</label>
						<select name="game-theme" id="theme-options">
						  <option value="0">Classic Retro</option>
						  <option value="1">Modern Neon</option>
						  <option value="2">Ocean Vibes</option>
						  <option value="3">Sunset Glow</option>
						  <option value="4">Forest Retreat</option>
						</select>
					</div>
					<div class="language-configs">
						<h1>Language Settings</h1>
						<hr>
						<label for="language-option">Choose language:</label>
						<select name="language" id="language-option">
							<option value="en">English 🇬🇧</option>
							<option value="pt">Portugues 🇵🇹</option>
						</select>
					</div>
					<button type="submit" class="btn btn-success btn-submit submit-options">Apply Changes</button>
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

		this.profileForm = {};
		this.settingsForm = {};

		this.counter = 0;
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

		this.#getUserSettings();
		this.#getUserInfo();
		this.#submit();
		this.#uploadImage();
		this.#generateNewSeed();
	}

	#getUserSettings() {
		callAPI("GET", "http://127.0.0.1:8000/api/settings/", null, (res, data) => {
			this.settingsForm.newLanguage = data.language;
			this.settingsForm.newTheme = data.gameTheme;
			this.#setSelectOptions("language-option" ,this.settingsForm.newLanguage);
			this.#setSelectOptions("theme-options" ,this.settingsForm.newTheme);
		});
	}

	#setSelectOptions(selector, data) {
		const elem = this.html.querySelector(`#${selector}`);
		elem.value = data;
	}

	#generateNewSeed() {
		const seedButton = this.html.querySelector("#seedButton")
		seedButton.addEventListener('click', (event) => {
			event.preventDefault();
			const newSeed = Math.random().toString(36).substring(2,7);
			let preview = this.html.querySelector(".image-preview");
			preview.src = "https://api.dicebear.com/8.x/bottts/svg?seed=" + newSeed;
			this.profileForm.newImage = '';
			this.profileForm.newSeed = newSeed;
		})
	}

	#uploadImage() {
		const uploadImage = this.html.querySelector("#newImage")
		uploadImage.addEventListener('change', (event) => {
			event.preventDefault();
			let preview = this.html.querySelector(".image-preview");
			preview.src = URL.createObjectURL(uploadImage.files[0]);
			this.profileForm.newImage = uploadImage.files[0];
			this.profileForm.newSeed = '';
		})
	}

	#submit() {
		const settingsForm = this.html.querySelector("#settings-form");
		settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const languageOption = this.html.querySelector("#language-option");
			if (this.settingsForm.newLanguage == languageOption.options[languageOption.selectedIndex].value)
				this.settingsForm.newLanguage = '';
			else
				this.settingsForm.newLanguage = languageOption.options[languageOption.selectedIndex].value;

			const themeOptions = this.html.querySelector("#theme-options");
			if (this.settingsForm.newTheme == themeOptions.options[themeOptions.selectedIndex].value)
				this.settingsForm.newTheme = '';
			else
				this.settingsForm.newTheme = themeOptions.options[themeOptions.selectedIndex].value;

			if (this.profileForm.newUsername == this.html.querySelector("#new-username").value.trim())
				this.profileForm.newUsername = '';
			else
				this.profileForm.newUsername = this.html.querySelector("#new-username").value.trim();
			
			if (this.profileForm.newBio == this.html.querySelector("#new-bio").value.trim())
				this.profileForm.newBio = '';
			else
				this.profileForm.newBio = this.html.querySelector("#new-bio").value.trim();

			if (this.profileForm.newImage)
			{	
				const imageData = new FormData();
            	imageData.append('image', this.profileForm.newImage);
				fetch('http://127.0.0.1:8000/api/profile/setimage', {
					method: 'POST',
					body: imageData,
					credentials: 'include'
				})
			}
			callAPI("POST", "http://127.0.0.1:8000/api/profile/setnewconfigs", this.profileForm, this.#apiResHandlerCalback);
			callAPI("POST", "http://127.0.0.1:8000/api/settings/setnewsettings", this.settingsForm);
		});
	}


	#apiResHandlerCalback = (res, data) => {
		if (res.ok && data.message === "success")
			this.#hideErrorMessage("username-error-message");
		else
			this.#showErrorMessage("username-error-message");
	}

	#hideErrorMessage(elementClass) {
		const errorMessage = this.html.querySelector("." + elementClass);
		errorMessage.classList.remove("show");
		errorMessage.classList.add("hide");
	}

	#showErrorMessage(elementClass) {
		const errorMessage = this.html.querySelector("." + elementClass);
		errorMessage.classList.remove("hide");
		errorMessage.classList.add("show");
	}

	#getUserInfo() {
		callAPI("GET", "http://127.0.0.1:8000/api/profile/", null, (res, data) => {
			this.#loadProfile(data);
		});
	}

	#loadProfile(data) {
		this.#loadImage(data.image_url);
		this.#loadUsername(data.username);
		this.#loadBio(data.bio);
	}

	#loadImage(image_url) {
		const htmlElement = this.html.querySelector('.image-preview');
		htmlElement.src = image_url;
	}

	#loadUsername(username) {
		const htmlElement = this.html.querySelector('#new-username');
		htmlElement.value = username;
		this.profileForm.newUsername = username
	}

	#loadBio(bio) {
		const htmlElement = this.html.querySelector('#new-bio');
		htmlElement.value = bio;
		this.profileForm.newBio = bio;
	}

}

customElements.define("app-configs", AppConfigs);