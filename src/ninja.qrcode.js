(function (ninja) {
	var qrC = ninja.qrCode = {
		getTypeNumber: function (text) {
			var lengthCalculation = text.length * 8 + 12;
			if (lengthCalculation < 72) { return 1; }
			else if (lengthCalculation < 128) { return 2; }
			else if (lengthCalculation < 208) { return 3; }
			else if (lengthCalculation < 288) { return 4; }
			else if (lengthCalculation < 368) { return 5; }
			else if (lengthCalculation < 480) { return 6; }
			else if (lengthCalculation < 528) { return 7; }
			else if (lengthCalculation < 688) { return 8; }
			else if (lengthCalculation < 800) { return 9; }
			else if (lengthCalculation < 976) { return 10; }
			return null;
		},

		// Enhanced QR canvas — larger, cleaner, with color coding
		// fgColor: foreground color (dark modules)
		// bgColor: background color (light modules)
		createCanvas: function (text, sizeMultiplier, fgColor, bgColor) {
			sizeMultiplier = (sizeMultiplier == undefined) ? 4 : sizeMultiplier; // default 4 (was 2)
			fgColor = fgColor || "#1a1a2e";
			bgColor = bgColor || "#ffffff";

			var typeNumber = qrC.getTypeNumber(text);
			var qrcode = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
			qrcode.addData(text);
			qrcode.make();

			var modules = qrcode.getModuleCount();
			var quiet = 2; // quiet zone modules
			var totalModules = modules + quiet * 2;
			var tileSize = sizeMultiplier;
			var width = totalModules * tileSize;
			var height = totalModules * tileSize;

			var canvas = document.createElement('canvas');
			var scale = 4; // high-DPI sharpness
			canvas.width = width * scale;
			canvas.height = height * scale;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			canvas.style.borderRadius = '8px';

			var ctx = canvas.getContext('2d');
			ctx.scale(scale, scale);

			// Background with quiet zone
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, width, height);

			// Draw modules with rounded corners for elegance
			for (var row = 0; row < modules; row++) {
				for (var col = 0; col < modules; col++) {
					if (qrcode.isDark(row, col)) {
						var x = (col + quiet) * tileSize;
						var y = (row + quiet) * tileSize;
						var r = tileSize * 0.15; // corner radius
						ctx.fillStyle = fgColor;
						// Rounded rect
						ctx.beginPath();
						ctx.moveTo(x + r, y);
						ctx.lineTo(x + tileSize - r, y);
						ctx.quadraticCurveTo(x + tileSize, y, x + tileSize, y + r);
						ctx.lineTo(x + tileSize, y + tileSize - r);
						ctx.quadraticCurveTo(x + tileSize, y + tileSize, x + tileSize - r, y + tileSize);
						ctx.lineTo(x + r, y + tileSize);
						ctx.quadraticCurveTo(x, y + tileSize, x, y + tileSize - r);
						ctx.lineTo(x, y + r);
						ctx.quadraticCurveTo(x, y, x + r, y);
						ctx.fill();
					}
				}
			}

			return canvas;
		},

		showQrCode: function (keyValuePair, sizeMultiplier) {
			for (var key in keyValuePair) {
				var value = keyValuePair[key];
				try {
					if (document.getElementById(key)) {
						document.getElementById(key).innerHTML = "";
						// Color code: public (green tint) vs private (dark red tint)
						var isPrivate = key.toLowerCase().indexOf("private") >= 0;
						var fg = isPrivate ? "#7f1d1d" : "#064e3b";
						var bg = "#ffffff";
						document.getElementById(key).appendChild(
							qrC.createCanvas(value, sizeMultiplier, fg, bg)
						);
					}
				}
				catch (e) { }
			}
		}
	};
})(ninja);
