(function (parsec) {
	var status = parsec.status = function() {
		var cryptoCase = "";
		if (window.crypto && window.crypto.getRandomValues) {
			document.getElementById("statuscrypto").innerHTML = "&#10004;"; //✔
			cryptoCase = "good";
		}
		else {
			document.getElementById("statuscrypto").innerHTML = "&times;"; //×
			cryptoCase = "bad";
		}

		var protocolCase = "";
		switch (window.location.protocol) {
			case 'file:':
				document.getElementById("statusprotocol").innerHTML = "&#10004;"; //✔
				protocolCase = "good";
				break;
			case 'http:':
			case 'https:':
				document.getElementById("statusprotocol").innerHTML = "&#9888;"; //⚠
				protocolCase = "bad";
				break;
			default:
		}

		var unitTestsCase = "";
		var unitTests = function () {
			var result = parsec.unitTests.runSynchronousTests();
			if (result.passCount == result.testCount) {
				document.getElementById("statusunittests").innerHTML = "&#10004;"; //✔
				unitTestsCase = "good";
			}
			else {
				document.getElementById("statusunittests").innerHTML = "&times;"; //×
				unitTestsCase = "bad";
			}
		};

		var showCrypto = function () {
			document.getElementById('statuscrypto' + cryptoCase).style.display = 'block';
		};

		var showProtocol = function () {
			document.getElementById('statusprotocol' + protocolCase).style.display = 'block';
		};

		var showUnitTests = function () {
			if(unitTestsCase != "") document.getElementById('statusunittests' + unitTestsCase).style.display = 'block';
		};

		var showKeyPool = function () {
			document.getElementById('statuskeypoolgood').style.display = 'block';
			document.getElementById("keypooltextarea").value = Bitcoin.KeyPool.toString();
		};

		return {
			unitTests: unitTests, showCrypto: showCrypto, showProtocol: showProtocol,
			showUnitTests: showUnitTests, showKeyPool: showKeyPool
		};
	}();
})(parsec);

parsec.tab = {
    select: function (walletTab) {
        // detect type: normally an HtmlElement/object but when string then get the element
        if (typeof walletTab === 'string') {
            walletTab = document.getElementById(walletTab);
        }
        var walletType = walletTab.getAttribute("id");

        if (walletTab.className.indexOf("selected") == -1) {
            // unselect all tabs
            for (var wType in parsec.wallets) {
                document.getElementById(wType).className = "tab";
                parsec.wallets[wType].close();
            }
            
            // don't open tab if entropy still being collected
            // exceptions: brainwallet detailwallet
            if (parsec.seeder.isStillSeeding == false || walletType == "brainwallet" || walletType == "detailwallet") {
            	walletTab.className += " selected";
            	document.getElementById("generate").style.display = "none";
                parsec.wallets[walletTab.getAttribute("id")].open();
            }
            else if (parsec.seeder.isStillSeeding == true && !(walletType == "brainwallet" || walletType == "detailwallet")) {
                document.getElementById("generate").style.display = "block";
            }
        }
    },

    whichIsOpen: function () {
        var isOpen;
        for (var wType in parsec.wallets) {
            isOpen = parsec.wallets[wType].isOpen();
            if (isOpen) {
                return wType;
            }
        }
        return null;
    }

};

parsec.getQueryString = function () {
	var result = {}, queryString = location.search.substring(1), re = /([^&=]+)=([^&]*)/g, m;
	while (m = re.exec(queryString)) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	return result;
};

// use when passing an Array of Functions
parsec.runSerialized = function (functions, onComplete) {
	onComplete = onComplete || function () { };

	if (functions.length === 0) onComplete();
	else {
		// run the first function, and make it call this
		// function when finished with the rest of the list
		var f = functions.shift();
		f(function () { parsec.runSerialized(functions, onComplete); });
	}
};

parsec.forSerialized = function (initial, max, whatToDo, onComplete) {
	onComplete = onComplete || function () { };

	if (initial === max) { onComplete(); }
	else {
		// same idea as runSerialized
		whatToDo(initial, function () { parsec.forSerialized(++initial, max, whatToDo, onComplete); });
	}
};

// use when passing an Object (dictionary) of Functions
parsec.foreachSerialized = function (collection, whatToDo, onComplete) {
	var keys = [];
	for (var name in collection) {
		keys.push(name);
	}
	parsec.forSerialized(0, keys.length, function (i, callback) {
		whatToDo(keys[i], callback);
	}, onComplete);
};