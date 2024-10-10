const onerrorEventImg = function(html) {
	const imgs = html.querySelectorAll(`img`);
	if(!imgs)
		return ;
	imgs.forEach((img) => {
		img.addEventListener("error", () => {
			img.src = "../img/default_profile.png"
		})
	})
}

export default onerrorEventImg