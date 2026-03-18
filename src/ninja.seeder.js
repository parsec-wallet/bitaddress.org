parsec.seeder = {
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
	_clockInterval: null,
	seederDependentWallets: ["singlewallet", "paperwallet", "bulkwallet", "vanitywallet", "splitwallet"],

	// Called from onload after object is fully constructed
	startClockEntropy: function () {
		// Seed from arrival moment
		SecureRandom.seedTime();
		if (window.performance && window.performance.now) {
			SecureRandom.seedInt16(Math.floor(window.performance.now() * 1000) & 0xFFFF);
		}
		// Background clock jitter — slow baseline, interaction accelerates
		parsec.seeder._clockInterval = setInterval(function () {
			if (!parsec.seeder.isStillSeeding) {
				clearInterval(parsec.seeder._clockInterval);
				return;
			}
			SecureRandom.seedTime();
			if (window.performance && window.performance.now) {
				SecureRandom.seedInt16(Math.floor(window.performance.now() * 10000) & 0xFFFF);
			}
			if (parsec.seeder.seedCount < parsec.seeder.seedLimit) {
				parsec.seeder.seedCount++;
				parsec.seeder.showPool();
			}
			if (parsec.seeder.seedCount >= parsec.seeder.seedLimit && parsec.seeder.isStillSeeding) {
				parsec.seeder.seedCount++;
				parsec.seeder.seedingOver();
			}
		}, 300);
	},

	// Any participant event seeds entropy
	seed: function (evt) {
		if (!evt) var evt = window.event;
		var timeStamp = new Date().getTime();
		if (parsec.seeder.seedCount >= parsec.seeder.seedLimit && parsec.seeder.isStillSeeding) {
			parsec.seeder.seedCount++;
			parsec.seeder.seedingOver();
			return;
		}
		if ((parsec.seeder.seedCount < parsec.seeder.seedLimit) && evt && (timeStamp - parsec.seeder.lastInputTime) > 40) {
			SecureRandom.seedTime();
			var x = evt.clientX || evt.pageX || 0;
			var y = evt.clientY || evt.pageY || 0;
			SecureRandom.seedInt16((x * y) & 0xFFFF);
			SecureRandom.seedInt16((timeStamp - parsec.seeder.lastInputTime) & 0xFFFF);
			if (x > 0 && y > 0) parsec.seeder.showPoint(x, y);
			parsec.seeder.seedCount += 3; // interaction is high-quality entropy
			if (parsec.seeder.seedCount > parsec.seeder.seedLimit) parsec.seeder.seedCount = parsec.seeder.seedLimit;
			parsec.seeder.lastInputTime = timeStamp;
			parsec.seeder.showPool();
		}
	},

	seedKeyPress: function (evt) {
		if (!evt) var evt = window.event;
		if (parsec.seeder.seedCount >= parsec.seeder.seedLimit && parsec.seeder.isStillSeeding) {
			parsec.seeder.seedCount++;
			parsec.seeder.seedingOver();
			return;
		}
		if ((parsec.seeder.seedCount < parsec.seeder.seedLimit) && evt.which) {
			var timeStamp = new Date().getTime();
			SecureRandom.seedTime();
			SecureRandom.seedInt8(evt.which);
			SecureRandom.seedInt8((timeStamp - parsec.seeder.lastInputTime) & 0xFF);
			parsec.seeder.seedCount += 2;
			if (parsec.seeder.seedCount > parsec.seeder.seedLimit) parsec.seeder.seedCount = parsec.seeder.seedLimit;
			parsec.seeder.lastInputTime = timeStamp;
			parsec.seeder.showPool();
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
		var percent = Math.min(100, Math.round((parsec.seeder.seedCount / parsec.seeder.seedLimit) * 100));

		var bar = document.getElementById("parsec-entropy-bar");
		var label = document.getElementById("parsec-entropy-label");
		if (bar) {
			bar.style.width = percent + "%";
			if (percent < 40) bar.style.background = "#ef4444";
			else if (percent < 75) bar.style.background = "#f59e0b";
			else bar.style.background = "#10b981";
		}
		if (label) {
			if (percent < 100) {
				label.innerHTML = percent + "% — collecting entropy";
			} else {
				label.innerHTML = "Entropy complete — generating wallet";
			}
		}

		var limitEl = document.getElementById("mousemovelimit");
		if (limitEl) limitEl.innerHTML = percent + "%";
	},

	showPoint: function (x, y) {
		var div = document.createElement("div");
		div.setAttribute("class", "seedpoint");
		div.style.top = y + "px";
		div.style.left = x + "px";
		document.body.appendChild(div);
		parsec.seeder.seedPoints.push(div);
	},

	removePoints: function () {
		for (var i = 0; i < parsec.seeder.seedPoints.length; i++) {
			document.body.removeChild(parsec.seeder.seedPoints[i]);
		}
		parsec.seeder.seedPoints = [];
	},

	seedingOver: function () {
		if (!parsec.seeder.isStillSeeding) return; // prevent double-fire
		parsec.seeder.isStillSeeding = false;
		if (parsec.seeder._clockInterval) clearInterval(parsec.seeder._clockInterval);
		parsec.status.unitTests();
		var walletType = parsec.tab.whichIsOpen();
		if (walletType == null) {
			parsec.tab.select("singlewallet");
		} else {
			parsec.tab.select(walletType);
		}
		document.getElementById("generate").style.display = "none";
		var culture = (parsec.getQueryString()["culture"] == null ? "en" : parsec.getQueryString()["culture"]);
		parsec.translator.translate(culture);
		parsec.seeder.removePoints();
	}
};
