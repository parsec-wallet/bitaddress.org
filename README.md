# Parsec Paper Export

Cypherpunk2048 Standard. Offline Bitcoin wallet generator.

Forked from [pointbiz/bitaddress.org](https://github.com/pointbiz/bitaddress.org). Maintained by [parsec-wallet](https://github.com/parsec-wallet).

## What This Is

A client-side Bitcoin wallet generator that runs entirely in your browser. All cryptographic operations use local JavaScript — no server ever sees your keys.

**If you are smart, you generate your wallet while disconnected from the internet.**

## Features

- **Single Wallet** — generate a Bitcoin address + private key
- **Paper Wallet** — printable paper wallets with QR codes
- **Bulk Wallet** — generate many addresses at once
- **Brain Wallet** — derive a key from a passphrase
- **Vanity Wallet** — generate addresses with custom prefixes
- **Split Wallet** — Shamir's secret sharing for key backup
- **Wallet Details** — inspect and verify existing keys

## Cypherpunk2048 Standard

- Zero remote dependencies at runtime
- All crypto from vetted local code
- Randomness from Web Crypto API
- Best used offline from a verified local artifact
- No analytics, no telemetry, no beacons

## Build

```bash
npm install
npm run build
```

Outputs: `parsec-paper-export.html` — a single self-contained HTML file.

## Usage

1. Download `parsec-paper-export.html`
2. Disconnect from the internet
3. Open the file in your browser
4. Generate your wallet
5. Print or record your keys
6. Close the browser

## License

Original: MIT License, Copyright (c) 2011-2016 bitaddress.org (pointbiz)
Parsec modifications: (c) BANKON. All rights reserved.

## Credits

- Original: [pointbiz/bitaddress.org](https://github.com/pointbiz/bitaddress.org)
- Fork: [parsec-wallet](https://github.com/parsec-wallet)
- Standard: Cypherpunk2048
