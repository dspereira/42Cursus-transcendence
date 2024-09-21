import {callAPI} from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";

const styles = `

#settings-form {
	color: ${colors.second_text};
	min-width: 460px;
}

.form-control, .form-select {
	border-radius: 5px;
	border-style: hidden;
	color: ${colors.second_text};
	background-color: ${colors.input_background};
}

.form-control::placeholder {
	color: ${colors.second_text};
}

.form-control:focus {
	background-color: ${colors.input_background};
	color: ${colors.second_text};
}

.form-control + input:focus {
	color:  ${colors.second_text};
}

.main-container {
	display: flex;
	gap: 10px;
	width: 100%;
}

.general-settings-container {
	width: 60%;
	/*background-color: red;*/
}

.image-settings-container {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 40%;
	min-width: 300px;

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

.btn-submit {
	width: 50%;
	margin-top: 30px;
	margin-bottom: 30px;
	color: ${colors.primary_text};
	background-color: ${colors.btn_default};
}

.btn-submit:hover {
	background-color: ${colors.btn_hover};
	color: ${colors.second_text};
}

.btn-img {
	width: 50%;
	max-width: 150px;
	/*font-size: clamp(0.5rem, 1vw, 1rem);*/
	color: ${colors.primary_text};
	background-color: ${colors.btn_default};
}

.btn-img:hover {
	background-color: ${colors.btn_hover};
	color: ${colors.second_text};
}

.form-check-input[type=checkbox] {
	background-color: ${colors.main_card};
	border-color: ${colors.second_text};
}

legend {
	font-size: 16px
}

#new-username, #new-bio, #theme-options, #language-options {
	background-image: none;
}

.hide {
	display: none;
}

.page-container {
	display: flex;
	flex-direction: column;
}

.btn-container {
	display: flex;
	width: 60%;
	justify-content: center;
}

.main-conf-text {
	font-size: 24px;
}

.div-margin {
	margin-bottom: 40px;
}

.small-margin {
	margin-bottom: 20px;
}

@media (max-width: 900px) {
	.main-container {
		flex-direction: column;
	}
	.general-settings-container, .image-settings-container {
		width: 100%;
	}
	.image-settings-container {
		justify-content: center;
	}
	.btn-container {
		width: 100%;
	}
	.btn-submit {
		width: 70%;
	}
}

`;

const getHtml = function(data) {
	const html = `
	<form id="settings-form">
		<div class="page-container">
			<div class="main-container">
				<div class="general-settings-container">
					<div class="alert alert-danger hide" role="alert"></div>
					<div class="alert alert-success hide" role="alert"></div>
					<div class="main-conf-text">Profile Settings</div>
					<hr>
					<label for="new-username">Change Username</label>
					<input type="text" class="form-control form-control-md small-margin" id="new-username" placeholder="New Username" maxlength="15">
					<label for="new-bio">Change Bio</label>
					<textarea type="text" class="form-control form-control-md div-margin" id="new-bio" placeholder="New Bio" rows="3" maxlength="255"></textarea>

					<div class="main-conf-text">Security Settings</div>
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
						<div class="form-check div-margin">
							<input class="form-check-input" type="checkbox" value="phone" id="phone">
							<label class="form-check-label" for="phone">
								Phone
							</label>
						</div>
					</fieldset>

					<div class="main-conf-text">Game Settings</div>
					<hr>
					<label for="theme-options">Choose the game theme:</label>
					<select class="form-select div-margin" id="theme-options" aria-label="Game theme selection">
						<option value="0" selected>Classic Retro</option>
						<option value="1">Modern Neon</option>
						<option value="2">Ocean Vibes</option>
						<option value="3">Sunset Glow</option>
						<option value="4">Forest Retreat</option>
					</select>

					<div class="main-conf-text">Language Settings</div>
					<hr>
					<label for="language-options">Choose language:</label>
					<select class="form-select" id="language-options" aria-label="Language selection">
						<option value="en">English &#x1F1EC;&#x1F1E7;</option>
						<option value="pt">Português &#x1F1F5;&#x1F1F9;</option>
						<option value="es">Espanhol &#x1F1EA;&#x1F1F8;</option>
					</select>
				</div>

				<div class="image-settings-container">
					<div class="img-container">
						<img src="../img/default_profile.png" class="image-preview" alt="Preview of the Image to be Changed">
					</div>
					<div class="img-buttons">
						<label for="new-image" class="btn btn-primary btn-img">Upload Image</label>
						<!--<input id="new-image" class="hide" type="file" accept="image/png, image/jpeg, image/webp">-->
						<input id="new-image" class="hide" type="file">
						<button class="btn btn-primary btn-img btn-new-seed">New Avatar</button>
					</div>
				</div>
			</div>
			<div class="btn-container"><button type="submit" class="btn btn-primary btn-submit">Apply Changes</button></div>
		</div>
	</form>
	`;
	return html;
}

const IMG_PATH = "https://api.dicebear.com/8.x/bottts/svg?seed=";
const MEGABYTE = 1048576;
const MAX_IMAGE_SIZE_BYTES = 1 * MEGABYTE;

const fileTypes = {
	"image/jpeg": true,
	"image/png": true,
	"image/webp": true
}

const isFalidFormat = function(type) {
	if (fileTypes[type])
		return true;
	return false;
}

const suportedFileTypesToString = function() {
	const length = Object.keys(fileTypes).length;

	let result = "";
	let idx = 0;
	for (let key in fileTypes) {
		if (idx < length - 1)
			result += ` ${key},`;
		else
			result += ` ${key}`;
		idx++;
	}
	return result;
}

const messages = {
	"success": "User settings updated with success",
	"usernameInvalid": "Invalid username",
	"imageSize": `The image size must not exceed ${MAX_IMAGE_SIZE_BYTES / MEGABYTE}MB`,
	"imageType": `Only the following formats are accepted:${suportedFileTypesToString()}`
}

export default class AppConfigs extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.imageSeed = "";
		this.imageFile = "";
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
		this.settingsForm = this.html.querySelector("#settings-form");
		this.usernameInp = this.html.querySelector("#new-username");
		this.bioInp = this.html.querySelector("#new-bio");
		this.gameThemeOption = this.html.querySelector("#theme-options");
		this.languageOption = this.html.querySelector("#language-options");
		this.imagePreview = this.html.querySelector(".image-preview");
		this.newSeedBtn = this.html.querySelector(".btn-new-seed");
		this.newImageInp = this.html.querySelector("#new-image");
		
		this.errorAlert =  this.html.querySelector(".alert-danger");
		this.successAlert = this.html.querySelector(".alert-success");
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
		this.#newSeedBtn();
		this.#setNewImageInput();
	}

	#submit() {
		this.settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();

			const username = this.usernameInp.value.trim();
			if (!this.#isValidUsername(username)) {
				this.#setFieldInvalid("username");
				this.#setErrorMessage("Invalid username!");
				return ;
			}

			const data = JSON.stringify({
				"username": username,
				"bio": this.bioInp.value.trim(),
				"game_theme": this.gameThemeOption.value.trim(),
				"language": this.languageOption.value.trim(),
				"image_seed": this.imageSeed.trim()
			});

			const formData = new FormData();
			if (data)
				formData.append('json', data);
			if (this.imageFile)
				formData.append('image', this.imageFile);

			callAPI("POST", "http://127.0.0.1:8000/api/settings/", formData, (res, resData) => {
				if (res.ok && resData) {
					this.#loadData(resData.settings);
					this.#cleanErrorStyles();
					this.#setSuccessMessage(messages.success);
				}
				if (!res.ok && resData) {
					this.#cleanSuccessMessage();
					this.#setFieldInvalid(resData.field);
					this.#setErrorMessage(resData.message);
				}
			});
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

	#isValidUsername(username) {
		let regex = /^[a-zA-Z0-9_-]+$/;
		return regex.test(username);
	}

	#newSeedBtn() {
		this.newSeedBtn.addEventListener("click", () => {
			this.imageSeed = `${this.usernameInp.value}-${Math.floor(Math.random() * 1000000)}`;
			this.imagePreview.setAttribute("src", `${IMG_PATH}${this.imageSeed}`);
			this.imageFile = "";
		});
	}

	#setNewImageInput() {
		this.newImageInp.addEventListener("change", () => {
			this.imageFile = this.newImageInp.files[0];
			if (!this.imageFile)
				return ;
			if (this.imageFile.size > MAX_IMAGE_SIZE_BYTES) {
				this.#setErrorMessage(messages.imageSize);
				return ;
			}
			if (!isFalidFormat(this.imageFile.type)) {
				this.#setErrorMessage(messages.imageType);
				return ;
			}
			this.imagePreview.setAttribute("src", URL.createObjectURL(this.imageFile));
			this.imageSeed = "";
		});
	}

	#setFieldInvalid(field) {
		if (!field)
			return ;
		const obj = {
			"username": () => this.usernameInp.classList.add("is-invalid"),
			"bio": () => this.bioInp.classList.add("is-invalid"),
			"game_theme": () => this.gameThemeOption.classList.add("is-invalid"),
			"language": () => this.languageOption.classList.add("is-invalid"),
			"image": () => {}
		}
		obj[field]();
	}

	#setErrorMessage(message) {
		if (!message)
			return ;
		this.errorAlert.classList.remove("hide");
		this.errorAlert.innerHTML = message;
	}

	#setSuccessMessage(message) {
		if (!message)
			return ;
		this.successAlert.classList.remove("hide");
		this.successAlert.innerHTML = message;
	}

	#cleanSuccessMessage() {
		this.successAlert.classList.add("hide");
	}

	#cleanErrorStyles() {
		const elm = this.html.querySelector(".is-invalid");
		if (elm)
			elm.classList.remove("is-invalid");
		this.errorAlert.classList.add("hide");
	}
}

customElements.define("app-configs", AppConfigs);