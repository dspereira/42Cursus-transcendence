import {redirect} from "../js/router.js";

const styles = `

	.side-panel {
		position: fixed;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 200px;
		height: 100%;
		/*padding: 10px 10px 10px 20px;*/
		border-right: 1px solid #2f3336;

		padding-left: 10px;
		padding-right: 10px;
	}

	.side-panel-header {
		margin-bottom: 16px;
		width: 100%;
	}

	.profile-photo {
		width: 35px;
		min-height: 35px;
		clip-path:circle();
		transition: transform 0.5s;
	}

	.profile-photo:hover {
		transform: scale(1.5);
	}

	.side-panel button {
		display: block;
		background : transparent;
		border: 0;
		font-family: innherit;
		text-align: left;
		padding: 0;
		margin-bottom: 10px;

		/*border: 1px solid red;*/
	}

	.side-panel button > span {
		display: inline-flex;
		align-items: center;
		gap: 15px;
	}

	.icon {
		font-size: 22px;
		padding: 1px 0px 1px 10px;
	}


	.icon-text {
		font-size: 14px;
		padding: 1px 10px 1px 0px;
	}

	/*.icon:hover {
		background-color: #dbd9d7;
		border-radius: 8px;
	}*/

	

	button:hover {
		background-color: #dbd9d7;
		border-radius: 8px;
	}


	/*.side-panel button i {
		position: relative;
		font-size: 22px;
		border: 1px solid blue;
	}

	.side-panel button > span > span {
		font-size: 16px;
		border: 1px solid green;
	}*/

	/*
	.side-panel button  {
		position: relative;
		font-size: 28px;
	}

	.side-panel button span {
		font-size: 28px;
	}
	*/

	.side-panel > nav {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		width: 100%
		
	}

	.content {
		margin-left: 255px;
		margin-right: 10px;
		padding-top: 40px;
		overflow: hidden;
	}

	@media (width < 920px) {
		.side-panel {
			width: 65px;
		}

		.side-panel button > span {
			display: inline-flex;
			align-items: center;
			gap: 12px;
			/*padding: 0 16px 0 12px;*/
		}

		.side-panel button > span > span  {
			display: none;
			visibility: hidden;
		}

		.content {
			margin-left: 70px;

		}
	}

`;

const getHtml = function(data) {
	const html = `
	
	<aside class="side-panel">
		<header class="side-panel-header">
			<img src="/img/fox_profile.png" class="profile-photo" alt="user profile photo"/>
		</header>
		<nav>
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
		<nav>

	</aside>

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


	<div class="content">

	<div class="row">
		<div class="col-md-6 offset-md-3">
			<signup-form></signup-form>
		</div>
  	</div>

	</div>

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

	}
}

customElements.define("side-panel", SidePanel);