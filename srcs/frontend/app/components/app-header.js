
const colors = {
	c1: "#FFFFFF",
	c2: "#526D82",
	c3: "#9DB2BF",
	c4: "#DDE6ED",
}

const styles = `	
	<style>
		body {
			margin: 0;
			padding: 0;
			background-color: ${colors.c1};
		}

		.avatar {
			width: 50px;
			clip-path:circle();
		}
		
		.logo {
			width: 115px;
		}

		.header {
			background-color: ${colors.c3};
			display: flex;
			justify-content: space-between;
			align-items: center;
			/* top | right | bottom | left */
			padding: 15px 30px 15px 30px;
		}

	</style>
`

const html = `
	<div class="app-header">
		<div class="header">
				<div class="logo">
					<img src="/img/logo_black.png" class="logo" alt="logo">
				</div>
				<div>
					<img src="/img/fox_profile.png" class="avatar" alt="profile">
				</div>
		</div>
	</div>
`

export default class AppHeader extends HTMLElement {

	constructor() {
		super()
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		const elmBody = document.createElement("div");
		elmBody.classList.add(`${this.elmtId}`);
		const styles = document.createElement("style");
		styles.textContent = this.#styles();
		elmBody.innerHTML = this.#html();
		this.appendChild(styles);
		this.appendChild(elmBody);
	}

	#styles() {
		return `
			@scope (.${this.elmtId}) {
				${styles}
			}
		` 
	}

	#html(){
		return html;
	}
}

customElements.define("app-header", AppHeader);
