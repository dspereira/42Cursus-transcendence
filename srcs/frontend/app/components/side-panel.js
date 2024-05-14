import {redirect} from "../js/router.js";


const styles = `

	.side-panel > nav {
		width: 100%
	}

	.logo {
		display: inline-flex;
		align-items: center;
		gap: 12px;
	}

	button {
		display: block;
		background : transparent;
		border: 0;
		padding: 0;
		font-family: innherit;
		text-align: left;
		margin-bottom: 15px;
		width: 100%;
	}

	.side-panel button > span {
		display: inline-flex;
		align-items: center;
		gap: 15px;
	}

	/*** OPEN ***/
	.open .side-panel {
		position: fixed;
		top: 90px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 200px;
		height: 100%;
		padding-top: 20px;
		padding-left: 10px;
		padding-right: 10px;

		/* Não terá border apenas um background de outra cor */
		border-right: 1px solid #2f3336;
	}

	.open .logo-img {
		width: 45px;
		margin-bottom: 25px;
		padding-left: 10px
	}

	.open .logo-text {
		font-size: 22px;
		padding-bottom: 25px;
	} 

	.open .icon {
		font-size: 22px;
		padding: 3px 0px 3px 10px;
	}

	.open .icon-text {
		font-size: 14px;
		padding: 3px 10px 3px 0px;
	}

	.open button:hover {
		background-color: #dbd9d7;
		border-radius: 6px;
	}

	.open .content {
		margin-left: 255px;
		margin-right: 10px;
		padding-top: 40px;
		overflow: hidden;
	}

	/*@media (width < 920px) {
		.side-panel {
			width: auto;
			padding-left: 3px;
			padding-right: 3px;
		}

		.logo-img {
			width: 40px;
			margin-bottom: 25px;
			padding-left: 8px
		}
	
		.logo-text {
			display: none;
		}

		.icon {
			font-size: 22px;
			padding: 8px 12px 8px 12px;
		}

		.icon-text  {
			display: none;
		}

		button:hover {
			background-color: transparent;
		}

		.icon:hover {
			background-color: #dbd9d7;
			border-radius: 3px;
		}

		.content {
			margin-left: 70px;

		}
	}*/

	/*** CLOSE ***/

	.close .side-panel {
		position: fixed;
		top: 90;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: auto;
		height: 100%;
		padding-top: 20px;
		padding-left: 3px;
		padding-right: 3px;

		/* Não terá border apenas um background de outra cor */
		border-right: 1px solid #2f3336;
	}

	.close .logo-img {
		width: 40px;
		margin-bottom: 25px;
		padding-left: 8px
	}

	.close .logo-text {
		display: none;
	}

	.close .icon {
		font-size: 22px;
		padding: 8px 12px 8px 12px;
	}

	.close .icon-text {
		display: none;
	}

	.close button:hover {
		background-color: transparent;
	}

	.close .icon:hover {
		background-color: #dbd9d7;
		border-radius: 3px;
	}

	.close .content {
		margin-left: 70px;
		margin-right: 10px;
		padding-top: 40px;
		overflow: hidden;
	}

	.hide {
		display: none;
	}

`;


const getHtml = function(data) {
	const html = `
	
	<div class="side-panel-wrapper open">
		<aside class="side-panel">
		<!--<header class="side-panel-header">
				<div class="logo">
					<img src="/img/logo.png" class="logo-img" alt="logo">
					<span class="logo-text"><strong>BlitzPong</strong></span>
				</div>
			</header>-->
			<nav>
				<button>
					<span>
						<i class="icon bi bi-house-door"></i>
						<span class="icon-text">Home</span>
					</span>
				</button>
				<button>
					<span>
						<i class="icon bi bi-person"></i>
						<span class="icon-text">Profile</span>
					</span>
				</button>
				<button>
					<span>
						<i class="icon bi bi-chat"></i>
						<span class="icon-text">Chat</span>
					</span>
				</button>
				<button>
					<span>
						<i class="icon bi bi-trophy"></i>
						<span class="icon-text">Tornement</span>
					</span>
				</button>
				<button class="close-btn">
					<span>
						<i class="icon bi bi-arrow-bar-left"></i>
						<span class="icon-text">Close</span>
					</span>
				</button>
				<button class="open-btn hide">
					<span>
						<i class="icon bi bi-arrow-bar-right"></i>
						<span class="icon-text">Open</span>
					</span>
				</button>
			<nav>
		</aside>
	</div>

	<!--<div class="content">

	<h1>Content Whatever</h1>

	<p>
	Bacon ipsum dolor amet doner salami pastrami drumstick meatloaf shoulder tenderloin sausage. Biltong bresaola filet mignon, swine drumstick cow rump picanha hamburger kevin fatback doner pig salami. Short ribs cow ribeye, turducken tail sirloin jowl prosciutto meatball chicken pancetta tenderloin hamburger. Ground round pork chop shank, sausage venison rump salami ribeye prosciutto kevin. Pork belly chicken rump, brisket flank andouille tenderloin kielbasa pig doner ground round ham venison. Short ribs pork belly turkey leberkas spare ribs salami landjaeger ground round strip steak tri-tip beef ribs frankfurter ham ball tip jowl. Tenderloin sirloin filet mignon ham hock, capicola cupim shank kevin.
	</p>
	<p>
	Rump drumstick tri-tip alcatra. Flank ground round pastrami beef short ribs pork belly jowl. Spare ribs beef ribs andouille, frankfurter short loin shankle venison salami turducken. Beef ribs alcatra capicola shoulder pork loin sirloin biltong turkey pancetta flank pork andouille bacon. Doner hamburger shoulder tenderloin flank prosciutto corned beef. Chislic tongue doner porchetta pastrami sirloin filet mignon leberkas brisket ribeye pork chop shank cupim corned beef sausage.
	</p>
	<p>	
	Sausage andouille t-bone kielbasa, doner chicken brisket burgdoggen hamburger prosciutto. Chicken chislic frankfurter meatloaf jerky spare ribs. Buffalo chuck andouille bresaola tongue bacon, short loin ham t-bone chicken pork chop. Brisket ground round short ribs, strip steak rump pork loin biltong pancetta. Biltong corned beef venison spare ribs ham hock, fatback turducken chislic buffalo ground round. Sausage burgdoggen hamburger, prosciutto sirloin filet mignon fatback meatloaf kevin pancetta ribeye biltong beef ribs kielbasa. Drumstick corned beef meatloaf shoulder t-bone porchetta.
	</p>
	<p>	
	Pastrami pork chop beef, brisket chuck tail salami buffalo bresaola fatback pork doner sirloin shoulder. Jowl meatloaf beef ribs boudin short ribs doner sausage chicken, meatball drumstick. Tenderloin pork beef pig andouille, cupim chislic. Pork beef chicken jerky bacon meatloaf strip steak turkey. Cupim swine chislic doner picanha meatball sausage spare ribs frankfurter pork chop. Rump fatback kielbasa prosciutto, venison capicola ground round tenderloin pork beef strip steak jerky. Shoulder short ribs burgdoggen pancetta meatball, strip steak pig leberkas drumstick jerky beef.
	</p>
	<p>	
	Porchetta capicola pork loin frankfurter brisket, short ribs ribeye sirloin swine chuck ground round meatloaf. Pork loin flank buffalo, tongue hamburger shank turducken chuck andouille swine tri-tip beef ribs ribeye brisket shoulder. Ham hock chicken meatball, hamburger beef ribs biltong porchetta sirloin tenderloin cow. Porchetta boudin burgdoggen, jowl chicken kevin ground round landjaeger. Jerky frankfurter jowl, tail tri-tip kielbasa chicken pork loin shoulder ham hock corned beef biltong filet mignon.
	</p>
	<p>
	Bacon ipsum dolor amet doner salami pastrami drumstick meatloaf shoulder tenderloin sausage. Biltong bresaola filet mignon, swine drumstick cow rump picanha hamburger kevin fatback doner pig salami. Short ribs cow ribeye, turducken tail sirloin jowl prosciutto meatball chicken pancetta tenderloin hamburger. Ground round pork chop shank, sausage venison rump salami ribeye prosciutto kevin. Pork belly chicken rump, brisket flank andouille tenderloin kielbasa pig doner ground round ham venison. Short ribs pork belly turkey leberkas spare ribs salami landjaeger ground round strip steak tri-tip beef ribs frankfurter ham ball tip jowl. Tenderloin sirloin filet mignon ham hock, capicola cupim shank kevin.
	</p>
	<p>
	Rump drumstick tri-tip alcatra. Flank ground round pastrami beef short ribs pork belly jowl. Spare ribs beef ribs andouille, frankfurter short loin shankle venison salami turducken. Beef ribs alcatra capicola shoulder pork loin sirloin biltong turkey pancetta flank pork andouille bacon. Doner hamburger shoulder tenderloin flank prosciutto corned beef. Chislic tongue doner porchetta pastrami sirloin filet mignon leberkas brisket ribeye pork chop shank cupim corned beef sausage.
	</p>
	<p>
	Sausage andouille t-bone kielbasa, doner chicken brisket burgdoggen hamburger prosciutto. Chicken chislic frankfurter meatloaf jerky spare ribs. Buffalo chuck andouille bresaola tongue bacon, short loin ham t-bone chicken pork chop. Brisket ground round short ribs, strip steak rump pork loin biltong pancetta. Biltong corned beef venison spare ribs ham hock, fatback turducken chislic buffalo ground round. Sausage burgdoggen hamburger, prosciutto sirloin filet mignon fatback meatloaf kevin pancetta ribeye biltong beef ribs kielbasa. Drumstick corned beef meatloaf shoulder t-bone porchetta.
	</p>
	<p>
	Pastrami pork chop beef, brisket chuck tail salami buffalo bresaola fatback pork doner sirloin shoulder. Jowl meatloaf beef ribs boudin short ribs doner sausage chicken, meatball drumstick. Tenderloin pork beef pig andouille, cupim chislic. Pork beef chicken jerky bacon meatloaf strip steak turkey. Cupim swine chislic doner picanha meatball sausage spare ribs frankfurter pork chop. Rump fatback kielbasa prosciutto, venison capicola ground round tenderloin pork beef strip steak jerky. Shoulder short ribs burgdoggen pancetta meatball, strip steak pig leberkas drumstick jerky beef.
	</p>
	<p>
	Porchetta capicola pork loin frankfurter brisket, short ribs ribeye sirloin swine chuck ground round meatloaf. Pork loin flank buffalo, tongue hamburger shank turducken chuck andouille swine tri-tip beef ribs ribeye brisket shoulder. Ham hock chicken meatball, hamburger beef ribs biltong porchetta sirloin tenderloin cow. Porchetta boudin burgdoggen, jowl chicken kevin ground round landjaeger. Jerky frankfurter jowl, tail tri-tip kielbasa chicken pork loin shoulder ham hock corned beef biltong filet mignon.		
	</p>
	</div>-->


	<!--<div class="content">

	<div class="row">
		<div class="col-md-6 offset-md-3">
			<signup-form></signup-form>
		</div>
  	</div>

	</div>-->

	`;
	return html;
}

export default class SidePanel extends HTMLElement {
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
		this.#openClosePanel("open");
		this.#openClosePanel("close");

	}

	#openClosePanel(status) {
		let btn = this.html.querySelector(`.${status}-btn`);
		btn.addEventListener("click", () => {
			let sidePanel = this.html.querySelector(".side-panel-wrapper");
			sidePanel.classList.toggle("close");
			sidePanel.classList.toggle("open");
			this.html.querySelector(".open-btn").classList.toggle("hide");
			this.html.querySelector(".close-btn").classList.toggle("hide");
		});		
	}
}

customElements.define("side-panel", SidePanel);