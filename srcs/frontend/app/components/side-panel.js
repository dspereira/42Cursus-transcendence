import {redirect} from "../js/router.js";


const styles = `

	.hide {
		display: none;
	}

	.side-panel {
		position: fixed;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		height: 100%;
		padding-top: 20px;
		padding-left: 5px;
		padding-right: 5px;

		/* Não terá border apenas um background de outra cor */
		border-right: 1px solid #2f3336;
	}

	.side-panel > nav {
		width: 100%
	}

	.header-container {
		display: flex;
		gap: 15px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 2px;
		padding-bottom: 20px;
	}
	
	.logo-img {
		width: 30px;
	}
	
	.logo-text {
		font-size: 16px;
	}
	

	button {
		display: block;
		background : transparent;
		border: 0;
		padding: 0;
		font-family: innherit;
		text-align: left;
		width: 100%;
	}

	.list-btn button {
		margin-bottom: 20px;
	}

	.link-btn button {
		margin-bottom: 10px;
	}

	.list-btn .icon {
		display: inline-block;
		font-size: 22px;
		padding: 8px 14px 8px 14px;
		text-align: center;
	}

	.list-btn .icon:hover {
		background-color: #dbd9d7;
		clip-path:circle();
	}

	.side-panel button > span {
		display: inline-flex;
		align-items: center;
		gap: 15px;
	}


	/*** OPEN ***/
	.open .side-panel {
		width: 200px;
	}

	.open .list-btn button{
		margin-bottom: 20px;
	}

	.open .link-btn .icon {
		font-size: 22px;
		padding: 3px 14px 3px 14px;
	}

	.open .link-btn .icon-text {
		font-size: 14px;
	}

	.open .link-btn button:hover {
		background-color: #dbd9d7;
		border-radius: 6px;
	}

	.open .content {
		margin-left: 255px;
		margin-right: 10px;
		padding-top: 40px;
		overflow: hidden;
	}


	/*** CLOSE ***/

	.close .side-panel {
		width: auto;
	}

	.close .list-btn button{
		margin-bottom: 15px;
	}

	.close #list:hover {
		background-color: #dbd9d7;
		clip-path:circle();
	}


	.close .link-btn .icon {
		font-size: 22px;
		padding: 8px 14px 8px 14px;
	}

	.close .link-btn .icon-text {
		display: none;
	}

	.close .link-btn button:hover {
		background-color: transparent;
	}

	.close .link-btn .icon:hover {
		background-color: #dbd9d7;
		border-radius: 3px;
	}

	.close .content {
		margin-left: 70px;
		margin-right: 10px;
		padding-top: 40px;
		overflow: hidden;
	}

`;


const getHtml = function(data) {
	const html = `
	
	<div class="side-panel-wrapper open">
		<aside class="side-panel">
			<nav>
				<div class="header-container">
					<div class="list-btn">
						<button>
							<span>
								<i class="icon bi bi-list"></i>
							</span>
						</button>
					</div>
					<div class="logo">
						<img src="/img/logo.png" class="logo-img" alt="logo">
						<span class="logo-text"><strong>BlitzPong</strong></span>
					</div>
				</div>
				<div class="link-btn">
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
				</div>
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
		this.#openClosePanel();

	}

	#openClosePanel() {
		let btn = this.html.querySelector(`.list-btn > button`);
		btn.addEventListener("click", () => {
			let sidePanel = this.html.querySelector(".side-panel-wrapper");
			sidePanel.classList.toggle("close");
			sidePanel.classList.toggle("open");
		});		
	}
}

customElements.define("side-panel", SidePanel);