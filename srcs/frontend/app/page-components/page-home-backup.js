const styles = `
	/*.user {
		font-size: 24px;
	}*/

	.side-panel {
		width: 70px;
		padding: 0px;
		margin: 0px;
		background-color: red; 
		
	}

`;

const html = `

<!--
<app-header></app-header>

<a href="/login/">Login</a>
<h1>Home Page</h1>
<br><br>
<app-test class="test" message="This Test message is awsome"></app-test>

<h2 class="id"></h1>
<h2 class="username"></h1>
<h2 class="email"></h1>
-->

<app-header></app-header>

<!--<side-panel></side-panel>-->

<div class="row justify-content-center">
	<div class="col-1 side-panel">
		<side-panel></side-panel>
	</div>
	<div class="col">
		<!--<signup-form></signup-form>-->
		<p>
		Bacon ipsum dolor amet cow filet mignon jerky shank. Venison meatloaf tongue pork belly sirloin. Shank chicken ribeye turducken, chuck flank rump pork capicola. Biltong alcatra cupim boudin. Tri-tip shankle picanha capicola chuck tongue, porchetta brisket boudin hamburger ground round turducken jowl ham.
		</p>
		<p>
		Porchetta meatloaf sirloin tongue jowl. Ham hock sausage corned beef, hamburger frankfurter ribeye kielbasa. Bresaola andouille ham, short loin shankle ground round turducken. Pork belly tri-tip boudin bacon ball tip shankle doner bresaola chislic ham hock biltong brisket.
		</p>
		<p>
		Alcatra bacon pork loin, biltong shoulder tongue t-bone fatback pork belly swine beef ribs frankfurter ham hock venison. Boudin alcatra sirloin, turkey tenderloin biltong porchetta turducken tongue pancetta pork belly kielbasa. Alcatra bresaola ribeye, fatback sausage ham swine meatball shoulder leberkas. Boudin picanha andouille, short loin buffalo shank kevin bresaola. Spare ribs bacon alcatra salami jowl ham hock ground round porchetta pork sirloin turkey. Ribeye venison short loin spare ribs, cupim andouille rump.
		</p>
		<p>
		Pork buffalo landjaeger jerky, short ribs tenderloin shank ball tip kevin drumstick picanha short loin chuck prosciutto filet mignon. T-bone corned beef tri-tip alcatra frankfurter rump sirloin pork filet mignon. Cupim hamburger kevin jerky chuck leberkas tail shoulder corned beef. Flank cow pork belly strip steak pork bacon porchetta swine tongue salami chicken.
		</p>
		<p>
		Meatloaf buffalo prosciutto salami alcatra, flank burgdoggen pork loin bacon. Swine pig rump chuck salami flank. Burgdoggen bresaola strip steak venison cow capicola, alcatra cupim doner. Ground round ham hock kielbasa, cow capicola shank ribeye salami jerky kevin spare ribs pork loin. Sausage pork loin swine shank venison.
		</p>
		</div>
</div>

`;

const title = "Home Page";

export default class PageHome extends HTMLElement {
	static #componentName = "page-home";

	constructor() {
		super()
		//this.#loadData();
		this.#initComponent();
		this.#render();
	}

	#initComponent() {
		this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
		this.html = document.createElement("div");
		this.html.classList.add(`${this.elmtId}`);
		this.styles = document.createElement("style");
		this.styles.textContent = this.#styles();
		this.html.innerHTML = this.#html();
	}

	#styles() {
		return `@scope (.${this.elmtId}) {${styles}}`;
	}

	#html() {
		return html;
	}

	#render() {
		this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#updateHtml() {
		this.html.querySelector(".id").textContent = this.data['id'];
		this.html.querySelector(".username").textContent = this.data['username'];
		this.html.querySelector(".email").textContent = this.data['email'];
	}

	#handleApiData(data) {
		this.data = {
			"id": data[0] ? data[0].user_id : null,
			"username": data[1] ? data[1].username : null,
			"email": data[2] ? data[2].email : null
		}
	}

	#handleApiStatusCodeErrors(res, data) {
		console.log(`Error: ${res.status} ${data["message"]}`);
	}

	async #callAPI(method, url) {
		try {
			const res = await fetch(url, {
				credentials: 'include',
				method: method
			});
			const data = await res.json();
			if (res.ok) {
				return data;
			}
			else {
				this.#handleApiStatusCodeErrors(res, data);
				return null;
			}
		}
		catch {
			// very what is the best way to handle this errors
			console.log("Error: Call API");
			return null;
		}
	}

	async #loadData() {

		// Arranjar maneira de configurar os pedidos à api numa estrutura e passar aqui

		const data = await Promise.all([
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/id"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/username"),
			this.#callAPI("GET", "http://127.0.0.1:8000/api/auth/email")
		]);
		this.#handleApiData(data);
		this.#updateHtml();
		//this.#render();
	}

	static get componentName() {
		return this.#componentName;
	}
}

customElements.define(PageHome.componentName, PageHome);