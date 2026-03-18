parsec.seeder.startClockEntropy();
// Seed from all participant interaction — not just mouse
document.addEventListener("mousemove", parsec.seeder.seed, false);
document.addEventListener("touchmove", function(evt) {
	if (evt.touches && evt.touches[0]) {
		parsec.seeder.seed({ clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY });
	}
}, false);
document.addEventListener("scroll", function() {
	SecureRandom.seedTime();
	if (parsec.seeder.isStillSeeding && parsec.seeder.seedCount < parsec.seeder.seedLimit) {
		parsec.seeder.seedCount++;
		parsec.seeder.showPool();
	}
}, false);
document.addEventListener("click", function(evt) {
	if (parsec.seeder.isStillSeeding) {
		parsec.seeder.seed(evt);
	}
}, false);

// run unit tests
if (parsec.getQueryString()["unittests"] == "true" || parsec.getQueryString()["unittests"] == "1") {
	parsec.unitTests.runSynchronousTests(true);
	parsec.translator.showEnglishJson();
}
// run async unit tests
if (parsec.getQueryString()["asyncunittests"] == "true" || parsec.getQueryString()["asyncunittests"] == "1") {
	parsec.unitTests.runAsynchronousTests(true);
}
// change language
parsec.translator.extractEnglishFromDomAndUpdateDictionary();
if (parsec.getQueryString()["culture"] != undefined) {
	parsec.translator.translate(parsec.getQueryString()["culture"]);
} else {
	parsec.translator.autoDetectTranslation();
}
// testnet
if (parsec.getQueryString()["testnet"] == "true" || parsec.getQueryString()["testnet"] == "1") {
	document.getElementById("testnet").innerHTML = parsec.translator.get("testneteditionactivated");
	document.getElementById("testnet").style.display = "block";
	document.getElementById("detailwifprefix").innerHTML = "'9'";
	document.getElementById("detailcompwifprefix").innerHTML = "'c'";
	Bitcoin.Address.networkVersion = 0x6F;
	Bitcoin.ECKey.privateKeyPrefix = 0xEF;
	parsec.testnetMode = true;
}
if (parsec.getQueryString()["showseedpool"] == "true" || parsec.getQueryString()["showseedpool"] == "1") {
	document.getElementById("seedpoolarea").style.display = "block";
}
