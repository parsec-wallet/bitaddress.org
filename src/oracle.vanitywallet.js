parsec.wallets.vanitywallet = {
    isOpen: function () {
        return (document.getElementById("vanitywallet").className.indexOf("selected") != -1);
    },

	open: function () {
		document.getElementById("vanityarea").style.display = "block";
	},

	close: function () {
		document.getElementById("vanityarea").style.display = "none";
		document.getElementById("vanitystep1area").style.display = "none";
		document.getElementById("vanitystep2area").style.display = "none";
		document.getElementById("vanitystep1icon").setAttribute("class", "more");
		document.getElementById("vanitystep2icon").setAttribute("class", "more");
	},

	generateKeyPair: function () {
		var key = new Bitcoin.ECKey(false);
		var publicKey = key.getPubKeyHex();
		var privateKey = key.getBitcoinHexFormat();
		document.getElementById("vanitypubkey").innerHTML = publicKey;
		document.getElementById("vanityprivatekey").innerHTML = privateKey;
		document.getElementById("vanityarea").style.display = "block";
		document.getElementById("vanitystep1area").style.display = "none";
	},

	addKeys: function () {
		var privateKeyWif = parsec.translator.get("vanityinvalidinputcouldnotcombinekeys");
		var bitcoinAddress = parsec.translator.get("vanityinvalidinputcouldnotcombinekeys");
		var publicKeyHex = parsec.translator.get("vanityinvalidinputcouldnotcombinekeys");
		try {
			var input1KeyString = document.getElementById("vanityinput1").value;
			var input2KeyString = document.getElementById("vanityinput2").value;

			// both inputs are public keys
			if (parsec.publicKey.isPublicKeyHexFormat(input1KeyString) && parsec.publicKey.isPublicKeyHexFormat(input2KeyString)) {
				// add both public keys together
				if (document.getElementById("vanityradioadd").checked) {
					var pubKeyByteArray = parsec.publicKey.getByteArrayFromAdding(input1KeyString, input2KeyString);
					if (pubKeyByteArray == null) {
						alert(parsec.translator.get("vanityalertinvalidinputpublickeysmatch"));
					}
					else {
						privateKeyWif = parsec.translator.get("vanityprivatekeyonlyavailable");
						bitcoinAddress = parsec.publicKey.getBitcoinAddressFromByteArray(pubKeyByteArray);
						publicKeyHex = parsec.publicKey.getHexFromByteArray(pubKeyByteArray);
					}
				}
				else {
					alert(parsec.translator.get("vanityalertinvalidinputcannotmultiple"));
				}
			}
			// one public key and one private key
			else if ((parsec.publicKey.isPublicKeyHexFormat(input1KeyString) && parsec.privateKey.isPrivateKey(input2KeyString))
							|| (parsec.publicKey.isPublicKeyHexFormat(input2KeyString) && parsec.privateKey.isPrivateKey(input1KeyString))
						) {
				privateKeyWif = parsec.translator.get("vanityprivatekeyonlyavailable");
				var pubKeyHex = (parsec.publicKey.isPublicKeyHexFormat(input1KeyString)) ? input1KeyString : input2KeyString;
				var ecKey = (parsec.privateKey.isPrivateKey(input1KeyString)) ? new Bitcoin.ECKey(input1KeyString) : new Bitcoin.ECKey(input2KeyString);
				// add 
				if (document.getElementById("vanityradioadd").checked) {
					var pubKeyCombined = parsec.publicKey.getByteArrayFromAdding(pubKeyHex, ecKey.getPubKeyHex());
				}
				// multiply
				else {
					var pubKeyCombined = parsec.publicKey.getByteArrayFromMultiplying(pubKeyHex, ecKey);
				}
				if (pubKeyCombined == null) {
					alert(parsec.translator.get("vanityalertinvalidinputpublickeysmatch"));
				} else {
					bitcoinAddress = parsec.publicKey.getBitcoinAddressFromByteArray(pubKeyCombined);
					publicKeyHex = parsec.publicKey.getHexFromByteArray(pubKeyCombined);
				}
			}
			// both inputs are private keys
			else if (parsec.privateKey.isPrivateKey(input1KeyString) && parsec.privateKey.isPrivateKey(input2KeyString)) {
				var combinedPrivateKey;
				// add both private keys together
				if (document.getElementById("vanityradioadd").checked) {
					combinedPrivateKey = parsec.privateKey.getECKeyFromAdding(input1KeyString, input2KeyString);
				}
				// multiply both private keys together
				else {
					combinedPrivateKey = parsec.privateKey.getECKeyFromMultiplying(input1KeyString, input2KeyString);
				}
				if (combinedPrivateKey == null) {
					alert(parsec.translator.get("vanityalertinvalidinputprivatekeysmatch"));
				}
				else {
					bitcoinAddress = combinedPrivateKey.getBitcoinAddress();
					privateKeyWif = combinedPrivateKey.getBitcoinWalletImportFormat();
					publicKeyHex = combinedPrivateKey.getPubKeyHex();
				}
			}
		} catch (e) {
			alert(e);
		}
		document.getElementById("vanityprivatekeywif").innerHTML = privateKeyWif;
		document.getElementById("vanityaddress").innerHTML = bitcoinAddress;
		document.getElementById("vanitypublickeyhex").innerHTML = publicKeyHex;
		document.getElementById("vanitystep2area").style.display = "block";
		document.getElementById("vanitystep2icon").setAttribute("class", "less");
	},

	openCloseStep: function (num) {
		// do close
		if (document.getElementById("vanitystep" + num + "area").style.display == "block") {
			document.getElementById("vanitystep" + num + "area").style.display = "none";
			document.getElementById("vanitystep" + num + "icon").setAttribute("class", "more");
		}
		// do open
		else {
			document.getElementById("vanitystep" + num + "area").style.display = "block";
			document.getElementById("vanitystep" + num + "icon").setAttribute("class", "less");
		}
	}
};