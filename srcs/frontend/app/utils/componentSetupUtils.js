const componentSetup = function(component, html, styles) {
	const compHtml = document.createElement("div");
	compHtml.innerHTML = html;
	if (styles) {
		const elmtId = `elmtId_${Math.floor(Math.random() * 100000000)}`;
		const compStyles = document.createElement("style");
		compStyles.textContent = `@scope (.${elmtId}) {${styles}}`;
		compHtml.classList.add(`${elmtId}`);
		component.appendChild(compStyles);
	}
	component.appendChild(compHtml);
	return compHtml;
}

export default componentSetup;