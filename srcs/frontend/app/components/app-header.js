
const colors = {
	c1: "#FFFFFF",
	c2: "#526D82",
	c3: "#9DB2BF",
	c4: "#DDE6ED",
}

const page = 
`
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
`;

export default class AppHeader extends HTMLElement {

	constructor() {
		super()
		this.innerHTML = page;
	}

}

customElements.define("app-header", AppHeader);
