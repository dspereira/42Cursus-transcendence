import PageLogin from "../page-components/page-login.js";
import PageSignup from "../page-components/page-signup.js";

const router = {
	"/login"	: PageLogin.componentName,
	"/signup"	: PageSignup.componentName
}

const render = function(route) {

	const page = router[route];
	const app = document.querySelector("#app");
	app.innerHTML = `<${page}></${page}>`;
	
	console.log(route);
}
render("/login");
//render("/signup");

