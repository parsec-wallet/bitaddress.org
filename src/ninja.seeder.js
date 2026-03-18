ninja.seeder = {
	init: (function () {
		document.getElementById("generatekeyinput").value = "";
	})(),

	seedLimit: (function () {
		var num = Crypto.util.randomBytes(12)[11];
		return 200 + Math.floor(num);
	})(),

	seedCount: 0,
	lastInputTime: new Date().getTime(),
	seedPoints: [],
	isStillSeeding: true,
	seederDependentWallets: ["singlewallet", "paperwallet", "bulkwallet", "vanitywallet", "splitwallet"],

	seed: function (evt) {
		if (!evt) var evt = window.event;
		var timeStamp = new Date().getTime();
		if (ninja.seeder.seedCount == ninja.seeder.seedLimit) {
			ninja.seeder.seedCount++;
			ninja.seeder.seedingOver();
		}
		else if ((ninja.seeder.seedCount < ninja.seeder.seedLimit) && evt && (timeStamp - ninja.seeder.lastInputTime) > 40) {
			SecureRandom.seedTime();
			SecureRandom.seedInt16((evt.clientX * evt.clientY));
			ninja.seeder.showPoint(evt.clientX, evt.clientY);
			ninja.seeder.seedCount++;
			ninja.seeder.lastInputTime = new Date().getTime();
			ninja.seeder.showPool();
		}
	},

	seedKeyPress: function (evt) {
		if (!evt) var evt = window.event;
		if (ninja.seeder.seedCount == ninja.seeder.seedLimit) {
			ninja.seeder.seedCount++;
			ninja.seeder.seedingOver();
		}
		else if ((ninja.seeder.seedCount < ninja.seeder.seedLimit) && evt.which) {
			var timeStamp = new Date().getTime();
			SecureRandom.seedTime();
			SecureRandom.seedInt8(evt.which);
			var keyPressTimeDiff = timeStamp - ninja.seeder.lastInputTime;
			SecureRandom.seedInt8(keyPressTimeDiff);
			ninja.seeder.seedCount++;
			ninja.seeder.lastInputTime = new Date().getTime();
			ninja.seeder.showPool();
		}
	},

	showPool: function () {
		var poolHex;
		if (SecureRandom.poolCopyOnInit != null) {
			poolHex = Crypto.util.bytesToHex(SecureRandom.poolCopyOnInit);
			document.getElementById("seedpool").innerHTML = poolHex;
			document.getElementById("seedpooldisplay").innerHTML = poolHex;
		}
		else {
			poolHex = Crypto.util.bytesToHex(SecureRandom.pool);
			document.getElementById("seedpool").innerHTML = poolHex;
			document.getElementById("seedpooldisplay").innerHTML = poolHex;
		}
		var percent = Math.round((ninja.seeder.seedCount / ninja.seeder.seedLimit) * 100);

		// Update progress bar instead of raw percentage text
		var bar = document.getElementById("parsec-entropy-bar");
		var label = document.getElementById("parsec-entropy-label");
		if (bar) {
			bar.style.width = percent + "%";
			// Color gradient: red → yellow → green
			if (percent < 40) bar.style.background = "#ef4444";
			else if (percent < 75) bar.style.background = "#f59e0b";
			else bar.style.background = "#10b981";
		}
		if (label) {
			label.innerHTML = percent + "% entropy collected";
		}

		// Update the small percentage on the main progress display only
		var limitEl = document.getElementById("mousemovelimit");
		if (limitEl) limitEl.innerHTML = percent + "%";

		// DO NOT overwrite tab labels — keep them readable
	},

	showPoint: function (x, y) {
		var div = document.createElement("div");
		div.setAttribute("class", "seedpoint");
		div.style.top = y + "px";
		div.style.left = x + "px";
		document.body.appendChild(div);
		ninja.seeder.seedPoints.push(div);
	},

	removePoints: function () {
		for (var i = 0; i < ninja.seeder.seedPoints.length; i++) {
			document.body.removeChild(ninja.seeder.seedPoints[i]);
		}
		ninja.seeder.seedPoints = [];
	},

	seedingOver: function () {
		ninja.seeder.isStillSeeding = false;
		ninja.status.unitTests();
		var walletType = ninja.tab.whichIsOpen();
		if (walletType == null) {
			ninja.tab.select("singlewallet");
		} else {
			ninja.tab.select(walletType)
		}
		document.getElementById("generate").style.display = "none";
		var culture = (ninja.getQueryString()["culture"] == null ? "en" : ninja.getQueryString()["culture"]);
		ninja.translator.translate(culture);
		ninja.seeder.removePoints();
	}
};
