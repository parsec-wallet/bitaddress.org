(function (wallets, qrCode) {
	var single = wallets.singlewallet = {
		_keyCache: null, // held only until DOM is built, then cleared

		isOpen: function () {
			return (document.getElementById("singlewallet").className.indexOf("selected") != -1);
		},

		open: function () {
			if (document.getElementById("btcaddress").innerHTML == "") {
				single.generateNewAddressAndKey();
			}
			document.getElementById("singlearea").style.display = "block";
		},

		close: function () {
			document.getElementById("singlearea").style.display = "none";
		},

		generateNewAddressAndKey: function () {
			try {
				var key = new Bitcoin.ECKey(false);
				key.setCompressed(true);
				var bitcoinAddress = key.getBitcoinAddress();
				var privateKeyWif = key.getBitcoinWalletImportFormat();

				// Public address — always visible, click to copy
				var addrEl = document.getElementById("btcaddress");
				addrEl.innerHTML = bitcoinAddress;
				addrEl.title = "Click to copy";
				addrEl.style.cursor = "pointer";
				addrEl.onclick = function () {
					if (navigator.clipboard) {
						navigator.clipboard.writeText(bitcoinAddress);
						addrEl.innerHTML = '<span style="color:#10b981;">Copied!</span>';
						setTimeout(function () { addrEl.innerHTML = bitcoinAddress; }, 1500);
					}
				};
				qrCode.showQrCode({ "qrcode_public": bitcoinAddress }, 4);

				// Private key — hidden by default, revealed on hover only
				var privEl = document.getElementById("btcprivwif");
				privEl.innerHTML = '<span class="parsec-secret-mask">hover to reveal</span>';
				privEl.setAttribute("data-revealed", "false");

				// Private QR — blurred by default
				qrCode.showQrCode({ "qrcode_private": privateKeyWif }, 4);
				var privQr = document.getElementById("qrcode_private");
				if (privQr) {
					privQr.style.filter = "blur(12px)";
					privQr.style.transition = "filter 0.3s ease";
				}

				// Store WIF temporarily for hover reveal — will be cleared
				single._keyCache = privateKeyWif;

				// Hover to reveal private key text
				privEl.onmouseenter = function () {
					if (single._keyCache) {
						privEl.innerHTML = single._keyCache;
						privEl.setAttribute("data-revealed", "true");
					} else {
						privEl.innerHTML = '<span class="parsec-secret-cleared">key cleared from memory</span>';
					}
				};
				privEl.onmouseleave = function () {
					privEl.innerHTML = '<span class="parsec-secret-mask">hover to reveal</span>';
					privEl.setAttribute("data-revealed", "false");
				};

				// Hover to unblur private QR
				if (privQr) {
					privQr.onmouseenter = function () { privQr.style.filter = "none"; };
					privQr.onmouseleave = function () { privQr.style.filter = "blur(12px)"; };
				}

				// Clear the ECKey from memory — zero the private key bytes
				if (key.priv) {
					key.priv = null;
				}

				// Auto-clear the WIF cache after 60 seconds
				setTimeout(function () {
					if (single._keyCache) {
						// Overwrite with zeros before nullifying
						single._keyCache = '\0'.repeat(single._keyCache.length);
						single._keyCache = null;
					}
				}, 60000);

			} catch (e) {
				alert(e);
				document.getElementById("btcaddress").innerHTML = "error";
				document.getElementById("btcprivwif").innerHTML = "error";
				document.getElementById("qrcode_public").innerHTML = "";
				document.getElementById("qrcode_private").innerHTML = "";
			}
		},

		// Called before generating a new key — clears previous
		clearKeyCache: function () {
			if (single._keyCache) {
				single._keyCache = '\0'.repeat(single._keyCache.length);
				single._keyCache = null;
			}
		}
	};
})(parsec.wallets, parsec.qrCode);
