var packageObject = require('./package.json');

module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		combine: {
			single: {
				input: "./src/parsec-ui.html",
				output: "./parsec-paper-export.html",
				tokens: [
					{ token: "//biginteger.js", file: "./src/biginteger.js" },
					{ token: "//bitcoinjs-lib.js", file: "./src/bitcoinjs-lib.js" },
					{ token: "//bitcoinjs-lib.address.js", file: "./src/bitcoinjs-lib.address.js" },
					{ token: "//bitcoinjs-lib.base58.js", file: "./src/bitcoinjs-lib.base58.js" },
					{ token: "//bitcoinjs-lib.ecdsa.js", file: "./src/bitcoinjs-lib.ecdsa.js" },
					{ token: "//bitcoinjs-lib.eckey.js", file: "./src/bitcoinjs-lib.eckey.js" },
					{ token: "//bitcoinjs-lib.util.js", file: "./src/bitcoinjs-lib.util.js" },
					{ token: "//cryptojs.js", file: "./src/cryptojs.js" },
					{ token: "//cryptojs.sha256.js", file: "./src/cryptojs.sha256.js" },
					{ token: "//cryptojs.pbkdf2.js", file: "./src/cryptojs.pbkdf2.js" },
					{ token: "//cryptojs.hmac.js", file: "./src/cryptojs.hmac.js" },
					{ token: "//cryptojs.aes.js", file: "./src/cryptojs.aes.js" },
					{ token: "//cryptojs.blockmodes.js", file: "./src/cryptojs.blockmodes.js" },
					{ token: "//cryptojs.ripemd160.js", file: "./src/cryptojs.ripemd160.js" },
					{ token: "//crypto-scrypt.js", file: "./src/crypto-scrypt.js" },
					{ token: "//ellipticcurve.js", file: "./src/ellipticcurve.js" },
					{ token: "//secrets.js", file: "./src/secrets.js" },
					{ token: "//oracle.key.js", file: "./src/oracle.key.js" },
					{ token: "//oracle.misc.js", file: "./src/oracle.misc.js" },
					{ token: "//oracle.onload.js", file: "./src/oracle.onload.js" },
					{ token: "//oracle.qrcode.js", file: "./src/oracle.qrcode.js" },
					{ token: "//oracle.seeder.js", file: "./src/oracle.seeder.js" },
					{ token: "//oracle.unittests.js", file: "./src/oracle.unittests.js" },
					{ token: "//oracle.translator.js", file: "./src/oracle.translator.js" },
					{ token: "//oracle.singlewallet.js", file: "./src/oracle.singlewallet.js" },
					{ token: "//oracle.paperwallet.js", file: "./src/oracle.paperwallet.js" },
					{ token: "//oracle.bulkwallet.js", file: "./src/oracle.bulkwallet.js" },
					{ token: "//oracle.brainwallet.js", file: "./src/oracle.brainwallet.js" },
					{ token: "//oracle.vanitywallet.js", file: "./src/oracle.vanitywallet.js" },
					{ token: "//oracle.splitwallet.js", file: "./src/oracle.splitwallet.js" },
					{ token: "//oracle.detailwallet.js", file: "./src/oracle.detailwallet.js" },
					{ token: "//qrcode.js", file: "./src/qrcode.js" },
					{ token: "//securerandom.js", file: "./src/securerandom.js" },
					{ token: "//main.css", file: "./src/main.css" },
					{ token: "//version", string: packageObject.version },
					// cultures
					{ token: "//cs.js", file: "./src/culture/cs.js" },
					{ token: "//de.js", file: "./src/culture/de.js" },
					{ token: "//el.js", file: "./src/culture/el.js" },
					{ token: "//es.js", file: "./src/culture/es.js" },
					{ token: "//fr.js", file: "./src/culture/fr.js" },
					{ token: "//hu.js", file: "./src/culture/hu.js" },
					{ token: "//it.js", file: "./src/culture/it.js" },
					{ token: "//jp.js", file: "./src/culture/jp.js" },
					{ token: "//pt-br.js", file: "./src/culture/pt-br.js" },
					{ token: "//ru.js", file: "./src/culture/ru.js" },
					{ token: "//zh-cn.js", file: "./src/culture/zh-cn.js" }
				]
			}
		},
		
		lineending: {               // Task
			dist: {                   // Target
				options: {              // Target options
					eol: 'lf'
				},
				files: {                // Files to process
					'./parsec-paper-export.html': ['./parsec-paper-export.html']
				}
			}
		}
	});

	grunt.file.defaultEncoding = 'utf-8';
	grunt.loadNpmTasks("grunt-combine");
	grunt.loadNpmTasks('grunt-lineending');
	grunt.registerTask("default", ["combine:single", "lineending"]);
};
