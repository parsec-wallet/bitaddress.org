// Seed from all participant interaction — not just mouse
document.addEventListener("mousemove", ninja.seeder.seed, false);
document.addEventListener("touchmove", function(evt) {
	if (evt.touches && evt.touches[0]) {
		ninja.seeder.seed({ clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY });
	}
}, false);
document.addEventListener("scroll", function() {
	SecureRandom.seedTime();
	if (ninja.seeder.isStillSeeding && ninja.seeder.seedCount < ninja.seeder.seedLimit) {
		ninja.seeder.seedCount++;
		ninja.seeder.showPool();
	}
}, false);
document.addEventListener("click", function(evt) {
	if (ninja.seeder.isStillSeeding) {
		ninja.seeder.seed(evt);
	}
}, false);

// run unit tests
if (ninja.getQueryString()["unittests"] == "true" || ninja.getQueryString()["unittests"] == "1") {
	ninja.unitTests.runSynchronousTests(true);
	ninja.translator.showEnglishJson();
}
// run async unit tests
if (ninja.getQueryString()["asyncunittests"] == "true" || ninja.getQueryString()["asyncunittests"] == "1") {
	ninja.unitTests.runAsynchronousTests(true);
}
// change language
ninja.translator.extractEnglishFromDomAndUpdateDictionary();
if (ninja.getQueryString()["culture"] != undefined) {
	ninja.translator.translate(ninja.getQueryString()["culture"]);
} else {
	ninja.translator.autoDetectTranslation();
}
// testnet
if (ninja.getQueryString()["testnet"] == "true" || ninja.getQueryString()["testnet"] == "1") {
	document.getElementById("testnet").innerHTML = ninja.translator.get("testneteditionactivated");
	document.getElementById("testnet").style.display = "block";
	document.getElementById("detailwifprefix").innerHTML = "'9'";
	document.getElementById("detailcompwifprefix").innerHTML = "'c'";
	Bitcoin.Address.networkVersion = 0x6F;
	Bitcoin.ECKey.privateKeyPrefix = 0xEF;
	ninja.testnetMode = true;
}
if (ninja.getQueryString()["showseedpool"] == "true" || ninja.getQueryString()["showseedpool"] == "1") {
	document.getElementById("seedpoolarea").style.display = "block";
}
