async function getToken() {
	const urlParams = new URLSearchParams(window.location.search);
	const contract = urlParams.get("contract");
	if (!contract) {
		document.getElementById("errorText").innerHTML = "вы не указали contract";
		document.getElementById("error").style.display = "block";
		return;
	}
	try {
		const { data } = await axios.get(
			`https://tonapi.io/v2/jettons/${contract}`
		);
		document.getElementById("tokenName").innerHTML = data.metadata.name;
		document.getElementById("tokenImage").src = data.metadata.image;
		const { data: res } = await axios.get(
			`https://tonapi.io/v2/rates?tokens=${contract}&currencies=usd`
		);
		let rate = "$" + res.rates[contract].prices.USD.toFixed(4);
		document.getElementById("tokenRate").innerHTML = rate;
		const percent = res.rates[contract].diff_24h.USD;
		document.getElementById("tokenPercent").innerHTML = `<span class="${
			percent.startsWith("−") ? "bad" : percent.startsWith("+") ? "good" : ""
		}">${percent} 24h<span>`;
		document.getElementById("widget").style.color =
			urlParams.get("color") || "white";
		document.getElementById("widget").style.backgroundColor =
			urlParams.get("bg") || "#202020";

		document.getElementById("widget").style.display = "flex";
	} catch (error) {
		console.error(error);
		document.getElementById("errorText").innerHTML =
			error?.response?.data?.error || "неизвестная ошибка";
		document.getElementById("error").style.display = "block";
	}
}

async function main() {
	while (true) {
		getToken();
		await sleep(10000);
	}
}

main();

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
