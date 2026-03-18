ninja.seeder = {
	init: (function () {
		document.getElementById("generatekeyinput").value = "";
		// Seed from arrival moment — the exact timestamp is entropy
		SecureRandom.seedTime();
		if (window.performance && window.performance.now) {
			SecureRandom.seedInt16(Math.floor(window.performance.now() * 1000) & 0xFFFF);
		}
		// Background entropy from CPU clock jitter — slow baseline without input
		// Participant interaction speeds things up significantly
		ninja.seeder._clockInterval = setInterval(function () {
			if (!ninja.seeder.isStillSeeding) {
				clearInterval(ninja.seeder._clockInterval);
				return;
			}
			SecureRandom.seedTime();
			if (window.performance && window.performance.now) {
				SecureRandom.seedInt16(Math.floor(window.performance.now() * 10000) & 0xFFFF);
			}
			// Clock alone advances slowly — 1 seed per tick
			if (ninja.seeder.seedCount < ninja.seeder.seedLimit) {
				ninja.seeder.seedCount++;
				ninja.seeder.showPool();
			}
			if (ninja.seeder.seedCount >= ninja.seeder.seedLimit) {
				ninja.seeder.seedCount = ninja.seeder.seedLimit;
				ninja.seeder.seedCount++;
				ninja.seeder.seedingOver();
			}
		}, 300); // every 300ms — slow drip without interaction
	})(),

	_clockInterval: null,

	seedLimit: (function () {
		var num = Crypto.util.randomBytes(12)[11];
		return 200 + Math.floor(num);
	})(),

	seedCount: 0,
	lastInputTime: new Date().getTime(),
	seedPoints: [],
	isStillSeeding: true,
	seederDependentWallets: ["singlewallet", "paperwallet", "bulkwallet", "vanitywallet", "splitwallet"],

	// Any participant event seeds entropy — not just mouse
	seed: function (evt) {
		if (!evt) var evt = window.event;
		var timeStamp = new Date().getTime();
		if (ninja.seeder.seedCount == ninja.seeder.seedLimit) {
			ninja.seeder.seedCount++;
			ninja.seeder.seedingOver();
		}
		else if ((ninja.seeder.seedCount < ninja.seeder.seedLimit) && evt && (timeStamp - ninja.seeder.lastInputTime) > 40) {
			SecureRandom.seedTime();
			// Seed from any coordinate — mouse, touch, pen
			var x = evt.clientX || evt.pageX || 0;
			var y = evt.clientY || evt.pageY || 0;
			SecureRandom.seedInt16((x * y) & 0xFFFF);
			// Also seed interaction timing delta
			SecureRandom.seedInt16((timeStamp - ninja.seeder.lastInputTime) & 0xFFFF);
			if (x > 0 && y > 0) ninja.seeder.showPoint(x, y);
			ninja.seeder.seedCount += 3; // interaction is high-quality entropy
			ninja.seeder.lastInputTime = timeStamp;
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
			SecureRandom.seedInt8((timeStamp - ninja.seeder.lastInputTime) & 0xFF);
			ninja.seeder.seedCount += 2;
			ninja.seeder.lastInputTime = timeStamp;
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
		var percent = Math.min(100, Math.round((ninja.seeder.seedCount / ninja.seeder.seedLimit) * 100));

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
				label.innerHTML = percent + "% — collecting entropy from your interaction and system clock";
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
		if (ninja.seeder._clockInterval) clearInterval(ninja.seeder._clockInterval);
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
